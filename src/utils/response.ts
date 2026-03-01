import { randomUUID } from "crypto";

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    latencyMs: number;
    endpoint: string;
    timestamp: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
    latencyMs: number;
    endpoint: string;
    timestamp: string;
  };
}

function buildMeta(endpoint: string, startTime: number) {
  return {
    requestId: randomUUID(),
    latencyMs: Math.round(Date.now() - startTime),
    endpoint,
    timestamp: new Date().toISOString(),
  };
}

export function successResponse<T>(data: T, endpoint: string, startTime: number): SuccessResponse<T> {
  return {
    success: true,
    data,
    meta: buildMeta(endpoint, startTime),
  };
}

export function errorResponse(code: string, message: string, endpoint: string, startTime: number): ErrorResponse {
  return {
    success: false,
    error: { code, message },
    meta: buildMeta(endpoint, startTime),
  };
}
