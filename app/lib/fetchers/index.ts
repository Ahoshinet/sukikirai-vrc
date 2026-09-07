import type { ParsedEntryRef } from "../entry-source";
import { fetchBoothItem } from "./booth";
import { FetchProfileError, type FetchedProfile } from "./types";
import {
  fetchVrchatAvatar,
  fetchVrchatGroup,
  fetchVrchatUser,
  fetchVrchatWorld,
} from "./vrchat";
import { fetchXProfile } from "./x";

export { FetchProfileError, type FetchedProfile };

interface FetchEnv {
  KV: KVNamespace;
  VRCHAT_USERNAME?: string;
  VRCHAT_PASSWORD?: string;
  VRCHAT_TOTP_SECRET?: string;
}

export async function fetchProfile(
  env: FetchEnv,
  ref: ParsedEntryRef,
): Promise<FetchedProfile> {
  if (ref.source === "x") {
    return fetchXProfile(ref.id);
  }
  if (ref.source === "booth") {
    return fetchBoothItem(ref.id);
  }

  const prefix = ref.id.split("_")[0];
  switch (prefix) {
    case "wrld":
      return fetchVrchatWorld(ref.id);
    case "usr":
      return fetchVrchatUser(env, ref.id);
    case "avtr":
      return fetchVrchatAvatar(env, ref.id);
    case "grp":
      return fetchVrchatGroup(env, ref.id);
    default:
      throw new FetchProfileError(
        "対応していないVRChatのIDです。",
        "invalid_response",
      );
  }
}
