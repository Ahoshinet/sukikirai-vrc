import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { captureException } = await import("./app/lib/sentry");

  let env: CloudflareEnv | undefined;
  try {
    ({ env } = await getCloudflareContext({ async: true }));
  } catch {
    return;
  }

  if (!env?.SENTRY_DSN) {
    return;
  }

  await captureException(error, {
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT ?? "production",
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
