import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }
  // ビルド中（静的生成）はマイグレーションしない。本番サーバー起動時にだけ適用する。
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }
  if (process.env.SKIP_DB_MIGRATIONS === "1") {
    return;
  }
  const { runMigrations } = await import("./app/db/migrate");
  await runMigrations();
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }

  const { captureException } = await import("./app/lib/sentry");

  await captureException(error, {
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? "production",
    request: { url: request.path, method: request.method },
    tags: {
      router: context.routerKind,
      route: context.routePath,
      route_type: context.routeType,
    },
    extra: {
      renderSource: context.renderSource,
      revalidateReason: context.revalidateReason,
    },
  });
};
