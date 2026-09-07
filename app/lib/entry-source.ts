import * as v from "valibot";

import type { CategoryKey } from "./categories";

export type EntrySourceKind = "x" | "vrchat" | "booth";

export interface ParsedEntryRef {
  source: EntrySourceKind;
  category?: CategoryKey;
  id: string;
  normalized: string;
}

export const SOURCE_LABELS: Record<EntrySourceKind, string> = {
  x: "X",
  vrchat: "VRChat",
  booth: "BOOTH",
};

const VRCHAT_PREFIX_CATEGORY: Record<string, CategoryKey> = {
  usr: "user",
  wrld: "world",
  avtr: "avatar",
  grp: "group",
};

const VRCHAT_ID = /\b(usr|wrld|avtr|grp)_[0-9a-f-]{8,}/i;
const BOOTH_URL = /^https?:\/\/(?:([\w-]+)\.)?booth\.pm\/(?:[a-z-]+\/)?items\/(\d+)/i;
const X_URL = /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/(?!i\/)([A-Za-z0-9_]{1,15})/i;
const X_HANDLE = /^@?([A-Za-z0-9_]{1,15})$/;

export function parseEntryRef(input: string): ParsedEntryRef | null {
  const value = input.trim();
  if (value === "") {
    return null;
  }

  const vrchat = value.match(VRCHAT_ID);
  if (vrchat) {
    const id = vrchat[0];
    const prefix = vrchat[1].toLowerCase();
    const category = VRCHAT_PREFIX_CATEGORY[prefix];
    const path =
      category === "user"
        ? "user"
        : category === "world"
          ? "world"
          : category === "avatar"
            ? "avatar"
            : "group";
    return {
      source: "vrchat",
      category,
      id,
      normalized: `https://vrchat.com/home/${path}/${id}`,
    };
  }

  const booth = value.match(BOOTH_URL);
  if (booth) {
    const shop = booth[1];
    const id = booth[2];
    return {
      source: "booth",
      category: "avatar",
      id,
      normalized: shop
        ? `https://${shop}.booth.pm/items/${id}`
        : `https://booth.pm/ja/items/${id}`,
    };
  }

  const xUrl = value.match(X_URL);
  if (xUrl) {
    const id = xUrl[1].toLowerCase();
    return {
      source: "x",
      category: "user",
      id,
      normalized: `https://x.com/${id}`,
    };
  }

  if (!value.includes("/") && !value.includes(".")) {
    const handle = value.match(X_HANDLE);
    if (handle) {
      const id = handle[1].toLowerCase();
      return {
        source: "x",
        category: "user",
        id,
        normalized: `https://x.com/${id}`,
      };
    }
  }

  return null;
}

export const EntryRefSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("X・VRChat・BOOTH のURLまたはIDを入力してください。"),
  v.maxLength(300, "入力が長すぎます。"),
  v.check(
    (value) => parseEntryRef(value) !== null,
    "X・VRChat・BOOTH のURLまたはIDとして認識できませんでした。",
  ),
);

export function validateEntryRef(input: string): string | null {
  const result = v.safeParse(EntryRefSchema, input);
  return result.success ? null : (result.issues[0]?.message ?? "入力を確認してください。");
}
