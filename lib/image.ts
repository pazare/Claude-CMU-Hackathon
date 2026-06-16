// Browser-only helpers for preparing a photo and cropping flyers out of it.

export interface PreparedImage {
  base64: string; // raw base64, no data: prefix (sent to the API)
  mediaType: "image/jpeg";
  dataUrl: string; // full data URL, kept so we can crop regions out of it
  width: number;
  height: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MAX_EDGE = 2000; // long-edge cap: keeps small poster text legible without huge token cost

/**
 * Load a File, downscale so the long edge is at most MAX_EDGE, and re-encode as
 * JPEG. Returns the base64 for the API plus the data URL and pixel dimensions so
 * Claude's bounding boxes (in this image's pixel space) can be cropped later.
 */
export async function fileToImage(file: File): Promise<PreparedImage> {
  const sourceUrl = await readAsDataUrl(file);
  const img = await loadImage(sourceUrl);

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read the image in this browser.");
  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  return {
    base64: dataUrl.split(",")[1] ?? "",
    mediaType: "image/jpeg",
    dataUrl,
    width,
    height,
  };
}

/**
 * Crop a flyer region out of a prepared image and return it as a JPEG data URL.
 * The box is clamped to the image bounds; a tiny pad keeps poster edges intact.
 */
export async function cropToDataUrl(
  image: PreparedImage,
  box: Box
): Promise<string> {
  const img = await loadImage(image.dataUrl);
  const pad = 4;
  const sx = Math.max(0, Math.floor(box.x) - pad);
  const sy = Math.max(0, Math.floor(box.y) - pad);
  const sw = Math.min(image.width - sx, Math.ceil(box.w) + pad * 2);
  const sh = Math.min(image.height - sy, Math.ceil(box.h) + pad * 2);
  if (sw < 8 || sh < 8) throw new Error("Region too small to crop.");

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop the image in this browser.");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new Error("That file did not load as an image. Try a JPG or PNG.")
      );
    img.src = src;
  });
}
