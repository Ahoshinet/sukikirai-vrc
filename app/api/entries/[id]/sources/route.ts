import { getEnv } from "../../../../db/client";
import { getSessionUser } from "../../../../lib/auth";
import { parseEntryRef, validateEntryRef } from "../../../../lib/entry-source";
import { FetchProfileError, fetchProfile } from "../../../../lib/fetchers";
import { addEntrySource } from "../../../../lib/mutations";
import {
  findEntryBySource,
  getEntryById,
  getEntrySources,
} from "../../../../lib/queries";
import { metaFromRequest } from "../../../../lib/request";
import { overRateLimit, rateLimited } from "../../../../lib/rate-limit";
import { CATEGORIES } from "../../../../lib/categories";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "情報の追加にはログインが必要です。" },
      { status: 401 },
    );
  }
  if (user.banned) {
    return Response.json({ error: "利用が制限されています。" }, { status: 403 });
  }

  const { id } = await params;
  const entry = await getEntryById(id);
  if (!entry) {
    return Response.json({ error: "対象が見つかりません。" }, { status: 404 });
  }

  const body = (await request.json()) as { reference?: string };
  const reference = body.reference ?? "";

  const meta = metaFromRequest(request);
  if (await overRateLimit(meta.ip, "register")) {
    return rateLimited("register");
  }

  const message = validateEntryRef(reference);
  if (message) {
    return Response.json({ error: message }, { status: 400 });
  }

  const ref = parseEntryRef(reference);
  if (!ref) {
    return Response.json(
      { error: "URLを解釈できませんでした。" },
      { status: 400 },
    );
  }

  const existing = await getEntrySources(entry.id);
  const owner = await findEntryBySource(ref.source, ref.id);
  if (owner) {
    return Response.json(
      {
        error:
          owner.id === entry.id
            ? "この情報はすでに追加されています。"
            : "この情報は別の対象に登録されています。",
        href: `/${CATEGORIES[owner.category].segment}/${owner.slug}`,
      },
      { status: 409 },
    );
  }

  const env = await getEnv();
  let profile;
  try {
    profile = await fetchProfile(env, ref);
  } catch (error) {
    if (error instanceof FetchProfileError) {
      return Response.json(
        { error: error.message },
        { status: error.code === "not_found" ? 404 : 502 },
      );
    }
    throw error;
  }

  const isVrchatUser =
    entry.category === "user" &&
    existing.some((source) => source.source === "vrchat");
  const applyIcon =
    ref.source === "x" && isVrchatUser && profile.imageUrl !== null;

  await addEntrySource({
    entryId: entry.id,
    source: ref.source,
    sourceId: ref.id,
    sourceUrl: ref.normalized,
    imageUrl: profile.imageUrl,
    applyIcon,
    userId: user.id,
    meta,
  });

  return Response.json({
    sources: await getEntrySources(entry.id),
    iconChanged: applyIcon,
  });
}
