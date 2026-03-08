import { promises as dns } from "dns";
import { Socket } from "net";

// @ts-ignore — no types for this package
import disposableDomains from "disposable-email-domains";

const disposableSet = new Set<string>(disposableDomains as string[]);

export interface EmailValidationResult {
  email: string;
  valid_syntax: boolean;
  mx_found: boolean;
  mx_records: Array<{ exchange: string; priority: number }>;
  smtp_reachable: boolean | null;
  smtp_response: string;
  is_disposable: boolean;
  score: number;
  verdict: "deliverable" | "risky" | "undeliverable" | "invalid";
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validateSyntax(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.includes(".");
}

async function lookupMx(domain: string): Promise<Array<{ exchange: string; priority: number }>> {
  try {
    const records = await dns.resolveMx(domain);
    return records
      .sort((a, b) => a.priority - b.priority)
      .map((r) => ({ exchange: r.exchange, priority: r.priority }));
  } catch {
    return [];
  }
}

function smtpCheck(email: string, mxHost: string): Promise<{ reachable: boolean; response: string }> {
  return new Promise((resolve) => {
    const socket = new Socket();
    let response = "";
    let step = 0;
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ reachable: false, response: "Timeout" });
    }, 10000);

    socket.connect(25, mxHost, () => {
      // connected, wait for greeting
    });

    socket.on("data", (data) => {
      const line = data.toString().trim();
      response = line;

      if (step === 0 && line.startsWith("220")) {
        step = 1;
        socket.write("EHLO verify.agenttoolbox.dev\r\n");
      } else if (step === 1 && (line.startsWith("250") || line.startsWith("220"))) {
        step = 2;
        socket.write("MAIL FROM:<verify@agenttoolbox.dev>\r\n");
      } else if (step === 2 && line.startsWith("250")) {
        step = 3;
        socket.write(`RCPT TO:<${email}>\r\n`);
      } else if (step === 3) {
        const reachable = line.startsWith("250");
        socket.write("QUIT\r\n");
        clearTimeout(timeout);
        socket.destroy();
        resolve({ reachable, response: line });
      } else if (line.startsWith("4") || line.startsWith("5")) {
        clearTimeout(timeout);
        socket.destroy();
        resolve({ reachable: false, response: line });
      }
    });

    socket.on("error", (err) => {
      clearTimeout(timeout);
      resolve({ reachable: false, response: `Connection error: ${err.message}` });
    });

    socket.on("close", () => {
      clearTimeout(timeout);
    });
  });
}

// ==========================================
// Third-party SMTP verification fallback chain
// ==========================================

function isSmtpConnectionError(response: string): boolean {
  return response.includes("Connection error") || response === "Timeout";
}

async function verifyViaAbstractAPI(email: string): Promise<boolean | null> {
  const key = process.env.ABSTRACTAPI_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${encodeURIComponent(email)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.is_smtp_valid?.value === "boolean") return data.is_smtp_valid.value;
    if (typeof data.is_smtp_valid === "boolean") return data.is_smtp_valid;
    return null;
  } catch {
    return null;
  }
}

async function verifyViaMailboxlayer(email: string): Promise<boolean | null> {
  const key = process.env.MAILBOXLAYER_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://apilayer.net/api/check?access_key=${key}&email=${encodeURIComponent(email)}&smtp=1&format=1`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    if (typeof data.smtp_check === "boolean") return data.smtp_check;
    return null;
  } catch {
    return null;
  }
}

async function verifyViaVerifalia(email: string): Promise<boolean | null> {
  const user = process.env.VERIFALIA_USERNAME;
  const pass = process.env.VERIFALIA_PASSWORD;
  if (!user || !pass) return null;
  try {
    const auth = Buffer.from(`${user}:${pass}`).toString("base64");
    const res = await fetch("https://api.verifalia.com/v2.6/email-validations", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries: [{ inputData: email }] }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const entry = data?.entries?.data?.[0];
    if (!entry) return null;
    // Verifalia classification: "Deliverable", "Risky", "Undeliverable", "Unknown"
    if (entry.classification === "Deliverable") return true;
    if (entry.classification === "Undeliverable") return false;
    return null; // Risky/Unknown
  } catch {
    return null;
  }
}

async function thirdPartySmtpVerify(email: string): Promise<{ reachable: boolean | null; response: string }> {
  // Try AbstractAPI first
  const abstractResult = await verifyViaAbstractAPI(email);
  if (abstractResult !== null) {
    return { reachable: abstractResult, response: abstractResult ? "Verified via AbstractAPI" : "Rejected via AbstractAPI" };
  }

  // Try Mailboxlayer
  const mailboxResult = await verifyViaMailboxlayer(email);
  if (mailboxResult !== null) {
    return { reachable: mailboxResult, response: mailboxResult ? "Verified via Mailboxlayer" : "Rejected via Mailboxlayer" };
  }

  // Try Verifalia
  const verifaliaResult = await verifyViaVerifalia(email);
  if (verifaliaResult !== null) {
    return { reachable: verifaliaResult, response: verifaliaResult ? "Verified via Verifalia" : "Rejected via Verifalia" };
  }

  // All failed
  return { reachable: null, response: "SMTP verification unavailable" };
}

// ==========================================

export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const result: EmailValidationResult = {
    email,
    valid_syntax: false,
    mx_found: false,
    mx_records: [],
    smtp_reachable: false,
    smtp_response: "",
    is_disposable: false,
    score: 0,
    verdict: "invalid",
  };

  // Step 1: Syntax
  result.valid_syntax = validateSyntax(email);
  if (!result.valid_syntax) {
    result.verdict = "invalid";
    return result;
  }

  const domain = email.split("@")[1].toLowerCase();

  // Step 2: Disposable check
  result.is_disposable = disposableSet.has(domain);

  // Step 3: MX lookup
  result.mx_records = await lookupMx(domain);
  result.mx_found = result.mx_records.length > 0;

  if (!result.mx_found) {
    result.verdict = "undeliverable";
    result.score = 0.2;
    return result;
  }

  // Step 4: SMTP check (try first 2 MX hosts)
  for (const mx of result.mx_records.slice(0, 2)) {
    const smtp = await smtpCheck(email, mx.exchange);
    result.smtp_response = smtp.response;
    if (smtp.reachable) {
      result.smtp_reachable = true;
      break;
    }
  }

  // Step 5: If local SMTP failed due to connection issues, try third-party APIs
  if (!result.smtp_reachable && isSmtpConnectionError(result.smtp_response)) {
    const thirdParty = await thirdPartySmtpVerify(email);
    result.smtp_reachable = thirdParty.reachable;
    result.smtp_response = thirdParty.response;
  }

  // Score calculation
  let score = 1.0;
  if (result.smtp_reachable === false) score -= 0.3;
  else if (result.smtp_reachable === null) score -= 0.15; // unknown = slight penalty
  if (result.is_disposable) score -= 0.1;
  if (result.smtp_response.startsWith("4")) score -= 0.1;
  result.score = Math.max(0, Math.round(score * 100) / 100);

  // Verdict
  if (result.smtp_reachable === true && !result.is_disposable) {
    result.verdict = "deliverable";
  } else if (result.smtp_reachable === true && result.is_disposable) {
    result.verdict = "risky";
  } else if (result.smtp_reachable === null && result.mx_found) {
    // Can't verify SMTP but MX exists
    result.verdict = result.is_disposable ? "risky" : "risky";
  } else if (result.mx_found) {
    result.verdict = "risky";
  } else {
    result.verdict = "undeliverable";
  }

  return result;
}
