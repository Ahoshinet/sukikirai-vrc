import { FetchProfileError, USER_AGENT, type FetchedProfile } from "./types";

interface FxUser {
  screen_name?: string;
  name?: string;
  avatar_url?: string | null;
  protected?: boolean;
}

export async function fetchXProfile(
  screenName: string,
): Promise<FetchedProfile> {
  const response = await fetch(
    `https://api.fxtwitter.com/${encodeURIComponent(screenName)}`,
    { headers: { "user-agent": USER_AGENT } },
  );

  if (response.status === 404) {
    throw new FetchProfileError("アカウントが見つかりません。", "not_found");
  }
  if (!response.ok) {
    throw new FetchProfileError("Xの情報を取得できませんでした。", "unavailable");
  }

  const data = (await response.json()) as { user?: FxUser };
  const user = data.user;
  if (!user?.name) {
    throw new FetchProfileError(
      "Xの応答を解釈できませんでした。",
      "invalid_response",
    );
  }

  return {
    name: user.name,
    imageUrl: user.avatar_url
      ? user.avatar_url.replace("_normal.", "_400x400.")
      : null,
    category: "user",
  };
}
