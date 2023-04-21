import pako from "pako";

export function deflateString(str: string): string {
  const compressed = pako.deflate(str, {
    level: 9,
  });
  const b64encoded = Buffer.from(compressed).toString("base64");
  return encodeURIComponent(b64encoded);
}

export function inflateString(str: string): string {
  const compressed = Buffer.from(str, "base64");
  const decompressed = pako.inflate(compressed, {
    to: "string",
  });
  return decodeURIComponent(decompressed);
}
