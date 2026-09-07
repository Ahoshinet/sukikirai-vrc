import { getEnv } from "../../db/client";
import { getSessionUser } from "../../lib/auth";
import { parseEntryRef, validateEntryRef } from "../../lib/entry-source";
import { FetchProfileError, fetchProfile } from "../../lib/fetchers";
import { createEntry } from "../../lib/mutations";
import { findEntryBySource } from "../../lib/queries";
import { metaFromRequest } from "../../lib/request";
import { overRateLimit, rateLimited } from "../../lib/rate-limit";
import { CATEGORIES } from "../../lib/categories";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "登録にはログインが必要です。" },
      { status: 401 },
    );
  }
  if (user.banned) {
    return Response.json({ error: "利用が制限されています。" }, { status: 403 });
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
    return Response.json({ error: "URLを解釈できませんでした。" }, { status: 400 });
  }

  const existing = await findEntryBySource(ref.source, ref.id);
  if (existing) {
    return Response.json(
      {
        error: "この対象はすでに登録されています。",
        href: `/${CATEGORIES[existing.category].segment}/${existing.slug}`,
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

  const created = await createEntry({
    category: profile.category,
    name: profile.name,
    imageUrl: profile.imageUrl,
    source: ref.source,
    sourceId: ref.id,
    sourceUrl: ref.normalized,
    userId: user.id,
    meta,
  });

  return Response.json({
    href: `/${CATEGORIES[profile.category].segment}/${created.slug}`,
    name: profile.name,
  });
}
