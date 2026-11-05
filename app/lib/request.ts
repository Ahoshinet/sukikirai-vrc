import { readEnv } from "./env";

export interface RequestMeta {
  ip: string;
  userAgent: string | null;
  country: string | null;
}

// クライアントIPは信頼できるプロキシが設定するヘッダーだけから読む。
// 既定は Cloudflare の cf-connecting-ip。nginx 直受けなら CLIENT_IP_HEADER=x-real-ip にし、
// nginx 側で `proxy_set_header X-Real-IP $remote_addr;` を必ず上書き設定すること。
export function metaFromRequest(request: Request): RequestMeta {
  const { CLIENT_IP_HEADER, CLIENT_COUNTRY_HEADER } = readEnv();
  const ip = request.headers.get(CLIENT_IP_HEADER)?.split(",")[0]?.trim();
  return {
    ip: ip || "unknown",
    userAgent: request.headers.get("user-agent"),
    country: request.headers.get(CLIENT_COUNTRY_HEADER),
  };
}
