/** Client-side image helpers for chat vision. */

export const MAX_CHAT_IMAGES = 4;
export const MAX_RAW_FILE_BYTES = 12 * 1024 * 1024;
export const MAX_OUTPUT_EDGE = 1280;
export const JPEG_QUALITY = 0.82;

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("NOT_IMAGE");
  }
  if (file.size > MAX_RAW_FILE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_OUTPUT_EDGE / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return readAsDataUrl(file);
    ctx.drawImage(bitmap, 0, 0, w, h);

    const jpeg = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    if (jpeg.length > 2_500_000) {
      return canvas.toDataURL("image/jpeg", 0.65);
    }
    return jpeg;
  } finally {
    bitmap.close();
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });
}
