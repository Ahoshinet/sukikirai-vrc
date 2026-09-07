const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export function newId(size = 16): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) {
    out += ALPHABET[byte % ALPHABET.length];
  }
  return out;
}

export async function anonLabel(
  userId: string,
  entryId: string,
  salt: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${entryId}:${userId}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest).slice(0, 5);
  let out = "";
  for (const byte of bytes) {
    out += ALPHABET[byte % ALPHABET.length];
  }
  return out.padEnd(8, "0").slice(0, 8);
}

export function newSlug(): string {
  return crypto.randomUUID();
}
