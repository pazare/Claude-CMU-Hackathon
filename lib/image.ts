// Browser-only helpers for preparing a photo and cropping flyers out of it.

export interface PreparedImage {
  base64: string; // downscaled JPEG sent to the API (cheaper, fast to detect on)
  mediaType: "image/jpeg";
  width: number; // dimensions of the sent image (the box coordinate space)
  height: number;
  /** A higher-resolution copy kept for sharp crops of each real poster. */
  full: { dataUrl: string; width: number; height: number };
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SENT_EDGE = 2000; // long-edge cap for the image Claude sees
const FULL_EDGE = 3200; // long-edge cap for the copy we crop from

interface Scaled {
  dataUrl: string;
  base64: string;
  width: number;
  height: number;
}

function scaleToCanvas(
  img: HTMLImageElement,
  maxEdge: number,
  quality: number
): Scaled {
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read the image in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, base64: dataUrl.split(",")[1] ?? "", width, height };
}

/**
 * Load a File and produce two JPEGs: a lighter one for Claude to detect flyers on
 * (its pixel space is where bounding boxes live), and a higher-resolution one kept
 * for sharp crops of each poster.
 */
export async function fileToImage(file: File): Promise<PreparedImage> {
  const sourceUrl = await readAsDataUrl(file);
  const img = await loadImage(sourceUrl);
  const sent = scaleToCanvas(img, SENT_EDGE, 0.9);
  const full = scaleToCanvas(img, FULL_EDGE, 0.92);
  return {
    base64: sent.base64,
    mediaType: "image/jpeg",
    width: sent.width,
    height: sent.height,
    full: { dataUrl: full.dataUrl, width: full.width, height: full.height },
  };
}

/**
 * Crop a flyer out of an image and return it as a JPEG data URL. The box is in the
 * given image's pixel space and is clamped to its bounds, with a small pad to keep
 * poster edges intact.
 */
export async function cropToDataUrl(
  source: { dataUrl: string; width: number; height: number },
  box: Box
): Promise<string> {
  const img = await loadImage(source.dataUrl);
  const pad = 6;
  const sx = Math.max(0, Math.floor(box.x) - pad);
  const sy = Math.max(0, Math.floor(box.y) - pad);
  const sw = Math.min(source.width - sx, Math.ceil(box.w) + pad * 2);
  const sh = Math.min(source.height - sy, Math.ceil(box.h) + pad * 2);
  if (sw < 8 || sh < 8) throw new Error("Region too small to crop.");

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop the image in this browser.");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL("image/jpeg", 0.88);
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
