import QRCode from "qrcode";

export interface QrInput {
  text: string;
  format?: "png" | "svg";
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export interface QrResult {
  data: string;
  format: string;
  text: string;
  mimeType: string;
}

const MAX_TEXT_LENGTH = 4296; // QR code max capacity

export async function generateQr(input: QrInput): Promise<QrResult> {
  const {
    text,
    format = "png",
    width = 300,
    margin = 4,
    darkColor = "#000000",
    lightColor = "#ffffff",
  } = input;

  if (text.length > MAX_TEXT_LENGTH) {
    throw Object.assign(
      new Error(`Text too long: ${text.length} chars (max ${MAX_TEXT_LENGTH})`),
      { name: "ValidationError" }
    );
  }

  const clampedWidth = Math.min(Math.max(width, 100), 1000);

  if (format === "svg") {
    const svg = await QRCode.toString(text, {
      type: "svg",
      width: clampedWidth,
      margin,
      color: { dark: darkColor, light: lightColor },
    });
    return {
      data: svg,
      format: "svg",
      text,
      mimeType: "image/svg+xml",
    };
  }

  const base64 = await QRCode.toDataURL(text, {
    width: clampedWidth,
    margin,
    color: { dark: darkColor, light: lightColor },
  });

  // Strip data:image/png;base64, prefix
  const raw = base64.replace(/^data:image\/png;base64,/, "");

  return {
    data: raw,
    format: "png",
    text,
    mimeType: "image/png",
  };
}
