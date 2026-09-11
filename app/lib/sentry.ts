interface Dsn {
  origin: string;
  projectId: string;
  publicKey: string;
}

let parsed: Dsn | null | undefined;

function parseDsn(dsn: string | undefined): Dsn | null {
  if (!dsn) {
    return null;
  }
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    if (!url.username || projectId === "") {
      return null;
    }
    return {
      origin: `${url.protocol}//${url.host}`,
      projectId,
      publicKey: url.username,
    };
  } catch {
    return null;
  }
}

function eventId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function frames(stack: string | undefined) {
  if (!stack) {
    return undefined;
  }
  const parsedFrames = stack
    .split("\n")
    .slice(1, 31)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("at "))
    .map((line) => {
      const match = line.match(/^at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/);
      if (!match) {
        return { function: line.slice(3) };
      }
      return {
        function: match[1] ?? "<anonymous>",
        filename: match[2],
        lineno: Number(match[3]),
        colno: Number(match[4]),
      };
    })
    .reverse();
  return parsedFrames.length > 0 ? { frames: parsedFrames } : undefined;
}

export interface SentryContext {
  dsn?: string;
  environment?: string;
  release?: string;
  request?: { url?: string; method?: string };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export async function captureException(
  error: unknown,
  context: SentryContext = {},
): Promise<void> {
  if (parsed === undefined) {
    parsed = parseDsn(context.dsn);
  }
  const dsn = parsed ?? parseDsn(context.dsn);
  if (!dsn) {
    return;
  }

  const err =
    error instanceof Error ? error : new Error(String(error ?? "unknown"));

  const id = eventId();
  const sentAt = new Date().toISOString();

  const header = JSON.stringify({ event_id: id, sent_at: sentAt });
  const body = JSON.stringify({
    event_id: id,
    timestamp: Date.now() / 1000,
    platform: "javascript",
    level: "error",
    logger: "sukikiraivrc",
    environment: context.environment ?? "production",
    release: context.release,
    tags: context.tags,
    extra: context.extra,
    request: context.request?.url
      ? { url: context.request.url, method: context.request.method }
      : undefined,
    exception: {
      values: [
        {
          type: err.name || "Error",
          value: err.message,
          stacktrace: frames(err.stack),
        },
      ],
    },
  });

  const envelope = `${header}\n${JSON.stringify({ type: "event" })}\n${body}\n`;

  try {
    await fetch(
      `${dsn.origin}/api/${dsn.projectId}/envelope/?sentry_key=${dsn.publicKey}&sentry_version=7`,
      {
        method: "POST",
        headers: { "content-type": "application/x-sentry-envelope" },
        body: envelope,
      },
    );
  } catch {
    // 監視の失敗でリクエストを壊さない
  }
}
