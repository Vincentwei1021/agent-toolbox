export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required and must be a non-empty string`);
  }
  return value.trim();
}

export function optionalString(value: unknown, defaultValue: string): string {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value !== "string") {
    throw new ValidationError("Expected a string value");
  }
  return value.trim() || defaultValue;
}

export function optionalNumber(value: unknown, defaultValue: number, min?: number, max?: number): number {
  if (value === undefined || value === null) return defaultValue;
  const num = typeof value === "number" ? value : parseInt(String(value), 10);
  if (isNaN(num)) {
    throw new ValidationError("Expected a number value");
  }
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  return num;
}

export function optionalBoolean(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return defaultValue;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
