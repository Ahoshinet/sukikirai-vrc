const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(input: string): Uint8Array {
  const clean = input.replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];

  for (const char of clean) {
    const index = BASE32.indexOf(char);
    if (index === -1) {
      throw new Error("TOTPシークレットの形式が不正です。");
    }
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((value >>> bits) & 0xff);
    }
  }

  return new Uint8Array(out);
}

export async function generateTotp(
  secret: string,
  atSeconds = Math.floor(Date.now() / 1000),
  step = 30,
  digits = 6,
): Promise<string> {
  const counter = Math.floor(atSeconds / step);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);

  const key = await crypto.subtle.importKey(
    "raw",
    base32Decode(secret) as unknown as ArrayBuffer,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, buffer),
  );

  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    (signature[offset + 1] << 16) |
    (signature[offset + 2] << 8) |
    signature[offset + 3];

  return (binary % 10 ** digits).toString().padStart(digits, "0");
}
