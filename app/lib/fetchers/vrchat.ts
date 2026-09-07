import { generateTotp } from "./totp";
import { FetchProfileError, USER_AGENT, type FetchedProfile } from "./types";

const API = "https://api.vrchat.cloud/api/1";
const COOKIE_KEY = "vrchat:auth-cookie";
const COOKIE_TTL = 60 * 60 * 24 * 25;

interface VrchatEnv {
  KV: KVNamespace;
  VRCHAT_USERNAME?: string;
  VRCHAT_PASSWORD?: string;
  VRCHAT_TOTP_SECRET?: string;
}

function baseHeaders(cookie?: string): HeadersInit {
  const headers: Record<string, string> = { "user-agent": USER_AGENT };
  if (cookie) {
    headers.cookie = cookie;
  }
  return headers;
}

function readAuthCookie(response: Response): string | null {
  const raw = response.headers.get("set-cookie");
  if (!raw) {
    return null;
  }
  const match = raw.match(/auth=[^;]+/);
  return match ? match[0] : null;
}

async function login(env: VrchatEnv): Promise<string> {
  const { VRCHAT_USERNAME, VRCHAT_PASSWORD, VRCHAT_TOTP_SECRET } = env;
  if (!VRCHAT_USERNAME || !VRCHAT_PASSWORD) {
    throw new FetchProfileError(
      "VRChatの認証情報が設定されていません。",
      "unauthorized",
    );
  }

  const basic = btoa(
    `${encodeURIComponent(VRCHAT_USERNAME)}:${encodeURIComponent(VRCHAT_PASSWORD)}`,
  );
  const response = await fetch(`${API}/auth/user`, {
    headers: { ...baseHeaders(), authorization: `Basic ${basic}` },
  });

  if (!response.ok) {
    throw new FetchProfileError(
      "VRChatへのログインに失敗しました。",
      "unauthorized",
    );
  }

  const cookie = readAuthCookie(response);
  if (!cookie) {
    throw new FetchProfileError(
      "VRChatの認証Cookieを取得できませんでした。",
      "unauthorized",
    );
  }

  const body = (await response.json()) as { requiresTwoFactorAuth?: string[] };
  const requires = body.requiresTwoFactorAuth ?? [];

  if (requires.length > 0) {
    if (!VRCHAT_TOTP_SECRET) {
      throw new FetchProfileError(
        "VRChatの2FAシークレットが設定されていません。",
        "unauthorized",
      );
    }
    const method = requires.includes("totp") ? "totp" : requires[0];
    const code = await generateTotp(VRCHAT_TOTP_SECRET);
    const verify = await fetch(`${API}/auth/twofactorauth/${method}/verify`, {
      method: "POST",
      headers: {
        ...baseHeaders(cookie),
        "content-type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    if (!verify.ok) {
      throw new FetchProfileError("VRChatの2FA検証に失敗しました。", "unauthorized");
    }
    const twoFactorCookie = readAuthCookie(verify);
    const merged = twoFactorCookie ? `${cookie}; ${twoFactorCookie}` : cookie;
    await env.KV.put(COOKIE_KEY, merged, { expirationTtl: COOKIE_TTL });
    return merged;
  }

  await env.KV.put(COOKIE_KEY, cookie, { expirationTtl: COOKIE_TTL });
  return cookie;
}

async function authedGet(
  env: VrchatEnv,
  path: string,
  retry = true,
): Promise<Response> {
  const cookie = (await env.KV.get(COOKIE_KEY)) ?? (await login(env));
  const response = await fetch(`${API}${path}`, {
    headers: baseHeaders(cookie),
  });

  if (response.status === 401 && retry) {
    await env.KV.delete(COOKIE_KEY);
    return authedGet(env, path, false);
  }
  return response;
}

export async function fetchVrchatWorld(id: string): Promise<FetchedProfile> {
  const response = await fetch(`${API}/worlds/${encodeURIComponent(id)}`, {
    headers: baseHeaders(),
  });

  if (response.status === 404) {
    throw new FetchProfileError("ワールドが見つかりません。", "not_found");
  }
  if (!response.ok) {
    throw new FetchProfileError(
      "VRChatの情報を取得できませんでした。",
      "unavailable",
    );
  }

  const data = (await response.json()) as {
    name?: string;
    thumbnailImageUrl?: string;
    imageUrl?: string;
  };
  if (!data.name) {
    throw new FetchProfileError(
      "VRChatの応答を解釈できませんでした。",
      "invalid_response",
    );
  }

  return {
    name: data.name,
    imageUrl: data.thumbnailImageUrl ?? data.imageUrl ?? null,
    category: "world",
  };
}

export async function fetchVrchatUser(
  env: VrchatEnv,
  id: string,
): Promise<FetchedProfile> {
  const response = await authedGet(env, `/users/${encodeURIComponent(id)}`);
  if (response.status === 404) {
    throw new FetchProfileError("ユーザーが見つかりません。", "not_found");
  }
  if (!response.ok) {
    throw new FetchProfileError(
      "VRChatの情報を取得できませんでした。",
      "unavailable",
    );
  }

  const data = (await response.json()) as {
    displayName?: string;
    currentAvatarThumbnailImageUrl?: string;
    userIcon?: string;
    profilePicOverride?: string;
  };
  if (!data.displayName) {
    throw new FetchProfileError(
      "VRChatの応答を解釈できませんでした。",
      "invalid_response",
    );
  }

  return {
    name: data.displayName,
    imageUrl:
      data.userIcon ||
      data.profilePicOverride ||
      data.currentAvatarThumbnailImageUrl ||
      null,
    category: "user",
  };
}

export async function fetchVrchatAvatar(
  env: VrchatEnv,
  id: string,
): Promise<FetchedProfile> {
  const response = await authedGet(env, `/avatars/${encodeURIComponent(id)}`);
  if (response.status === 404) {
    throw new FetchProfileError("アバターが見つかりません。", "not_found");
  }
  if (!response.ok) {
    throw new FetchProfileError(
      "VRChatの情報を取得できませんでした。",
      "unavailable",
    );
  }

  const data = (await response.json()) as {
    name?: string;
    thumbnailImageUrl?: string;
    imageUrl?: string;
  };
  if (!data.name) {
    throw new FetchProfileError(
      "VRChatの応答を解釈できませんでした。",
      "invalid_response",
    );
  }

  return {
    name: data.name,
    imageUrl: data.thumbnailImageUrl ?? data.imageUrl ?? null,
    category: "avatar",
  };
}

export async function fetchVrchatGroup(
  env: VrchatEnv,
  id: string,
): Promise<FetchedProfile> {
  const response = await authedGet(env, `/groups/${encodeURIComponent(id)}`);
  if (response.status === 404) {
    throw new FetchProfileError("グループが見つかりません。", "not_found");
  }
  if (!response.ok) {
    throw new FetchProfileError(
      "VRChatの情報を取得できませんでした。",
      "unavailable",
    );
  }

  const data = (await response.json()) as {
    name?: string;
    iconUrl?: string;
    bannerUrl?: string;
  };
  if (!data.name) {
    throw new FetchProfileError(
      "VRChatの応答を解釈できませんでした。",
      "invalid_response",
    );
  }

  return {
    name: data.name,
    imageUrl: data.iconUrl ?? data.bannerUrl ?? null,
    category: "group",
  };
}
