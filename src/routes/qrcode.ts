import { Hono } from "hono";
import { generateQr } from "../services/qrcode.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalString, optionalNumber } from "../utils/validation.js";

const qrcodeRouter = new Hono();

qrcodeRouter.post("/v1/qr", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/qr";
  try {
    const body = await c.req.json();
    const text = requireString(body.text, "text");
    const format = (optionalString(body.format, "png") === "svg" ? "svg" : "png") as "png" | "svg";
    const width = optionalNumber(body.width, 300, 100, 1000);
    const margin = optionalNumber(body.margin, 4, 0, 20);
    const darkColor = optionalString(body.darkColor, "#000000");
    const lightColor = optionalString(body.lightColor, "#ffffff");
    const result = await generateQr({ text, format, width, margin, darkColor, lightColor });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "QR generation failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "QR_ERROR";
    return c.json(errorResponse(code, message, endpoint, startTime), code === "VALIDATION_ERROR" ? 400 : 500);
  }
});

export { qrcodeRouter };
