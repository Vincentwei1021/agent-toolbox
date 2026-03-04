
export interface GeoIpInput {
  ip: string;
}

export interface GeoIpResult {
  ip: string;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  regionName: string | null;
  city: string | null;
  zip: string | null;
  lat: number | null;
  lon: number | null;
  timezone: string | null;
  isp: string | null;
  org: string | null;
  as: string | null;
}

const PRIVATE_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fd/i,
  /^fe80:/i,
];

function isValidIp(ip: string): boolean {
  // IPv4
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    const parts = ip.split(".").map(Number);
    return parts.every((p) => p >= 0 && p <= 255);
  }
  // IPv6 (basic check)
  if (ip.includes(":")) return true;
  return false;
}

function isPrivateIp(ip: string): boolean {
  return PRIVATE_RANGES.some((r) => r.test(ip));
}

export async function lookupGeoIp(input: GeoIpInput): Promise<GeoIpResult> {
  const { ip } = input;

  if (!isValidIp(ip)) {
    throw Object.assign(new Error(`Invalid IP address: ${ip}`), { name: "ValidationError" });
  }

  if (isPrivateIp(ip)) {
    throw Object.assign(new Error(`Private/reserved IP address: ${ip}`), { name: "ValidationError" });
  }

  // Use ip-api.com (free, 45 req/min, no key needed)
  const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });

  if (!res.ok) {
    throw new Error(`GeoIP lookup failed: HTTP ${res.status}`);
  }

  const data = await res.json() as Record<string, unknown>;

  if (data.status === "fail") {
    throw Object.assign(
      new Error(`GeoIP lookup failed: ${data.message || "unknown error"}`),
      { name: "ValidationError" }
    );
  }

  return {
    ip: (data.query as string) || ip,
    country: (data.country as string) || null,
    countryCode: (data.countryCode as string) || null,
    region: (data.region as string) || null,
    regionName: (data.regionName as string) || null,
    city: (data.city as string) || null,
    zip: (data.zip as string) || null,
    lat: (data.lat as number) ?? null,
    lon: (data.lon as number) ?? null,
    timezone: (data.timezone as string) || null,
    isp: (data.isp as string) || null,
    org: (data.org as string) || null,
    as: (data.as as string) || null,
  };
}
