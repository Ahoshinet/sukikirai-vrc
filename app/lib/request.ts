export interface RequestMeta {
  ip: string;
  userAgent: string | null;
  country: string | null;
}

export function metaFromRequest(request: Request): RequestMeta {
  return {
    ip: request.headers.get("cf-connecting-ip") ?? "unknown",
    userAgent: request.headers.get("user-agent"),
    country: request.headers.get("cf-ipcountry"),
  };
}
