import { FetchProfileError, USER_AGENT, type FetchedProfile } from "./types";

interface BoothItem {
  name?: string;
  images?: { original?: string; resized?: string }[];
  is_adult?: boolean;
}

export async function fetchBoothItem(itemId: string): Promise<FetchedProfile> {
  const response = await fetch(
    `https://booth.pm/ja/items/${encodeURIComponent(itemId)}.json`,
    { headers: { "user-agent": USER_AGENT } },
  );

  if (response.status === 404) {
    throw new FetchProfileError("商品が見つかりません。", "not_found");
  }
  if (!response.ok) {
    throw new FetchProfileError(
      "BOOTHの情報を取得できませんでした。",
      "unavailable",
    );
  }

  const data = (await response.json()) as BoothItem;
  if (!data.name) {
    throw new FetchProfileError(
      "BOOTHの応答を解釈できませんでした。",
      "invalid_response",
    );
  }

  return {
    name: data.name,
    imageUrl: data.images?.[0]?.original ?? null,
    category: "avatar",
  };
}
