import whoisJson from "whois-json";

export interface WhoisInput {
  domain: string;
}

export interface WhoisResult {
  domain: string;
  registrar: string | null;
  createdDate: string | null;
  expiresDate: string | null;
  updatedDate: string | null;
  status: string | string[] | null;
  nameServers: string | string[] | null;
  registrant: string | null;
  country: string | null;
  raw: Record<string, unknown>;
}

const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

export async function lookupWhois(input: WhoisInput): Promise<WhoisResult> {
  const { domain } = input;

  if (!DOMAIN_REGEX.test(domain)) {
    throw Object.assign(new Error(`Invalid domain: ${domain}`), { name: "ValidationError" });
  }

  const data = await whoisJson(domain) as Record<string, unknown>;

  return {
    domain,
    registrar: (data.registrar as string) || null,
    createdDate: (data.creationDate as string) || (data.createdDate as string) || null,
    expiresDate: (data.registrarRegistrationExpirationDate as string) || (data.expiresDate as string) || (data.expirationDate as string) || null,
    updatedDate: (data.updatedDate as string) || null,
    status: (data.domainStatus as string | string[]) || null,
    nameServers: (data.nameServer as string | string[]) || (data.nserver as string | string[]) || null,
    registrant: (data.registrantOrganization as string) || (data.registrantName as string) || null,
    country: (data.registrantCountry as string) || null,
    raw: data,
  };
}
