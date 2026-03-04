import { promises as dns } from "node:dns";

export interface DnsInput {
  domain: string;
  type?: string;
}

export interface DnsResult {
  domain: string;
  type: string;
  records: unknown[];
}

const VALID_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV", "CAA", "PTR"];
const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

export async function lookupDns(input: DnsInput): Promise<DnsResult> {
  const { domain, type = "A" } = input;
  const upperType = type.toUpperCase();

  if (!DOMAIN_REGEX.test(domain)) {
    throw Object.assign(new Error(`Invalid domain: ${domain}`), { name: "ValidationError" });
  }

  if (!VALID_TYPES.includes(upperType)) {
    throw Object.assign(
      new Error(`Invalid record type: ${type}. Valid: ${VALID_TYPES.join(", ")}`),
      { name: "ValidationError" }
    );
  }

  try {
    const records = await resolveByType(domain, upperType);
    return { domain, type: upperType, records };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "DNS lookup failed";
    if (msg.includes("ENOTFOUND") || msg.includes("ENODATA")) {
      return { domain, type: upperType, records: [] };
    }
    throw new Error(`DNS lookup failed: ${msg}`);
  }
}

async function resolveByType(domain: string, type: string): Promise<unknown[]> {
  switch (type) {
    case "A": return dns.resolve4(domain);
    case "AAAA": return dns.resolve6(domain);
    case "CNAME": return dns.resolveCname(domain);
    case "MX": return dns.resolveMx(domain);
    case "NS": return dns.resolveNs(domain);
    case "TXT": return (await dns.resolveTxt(domain)).map(r => r.join(""));
    case "SOA": return [await dns.resolveSoa(domain)];
    case "SRV": return dns.resolveSrv(domain);
    case "CAA": return dns.resolveCaa(domain);
    case "PTR": return dns.resolvePtr(domain);
    default: return dns.resolve(domain, type) as Promise<unknown[]>;
  }
}
