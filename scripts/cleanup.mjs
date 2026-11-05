// 定期メンテナンス。systemd timer（deploy/sukikiraivrc-cleanup.timer）から週1回実行する。
//   - 6か月より古い操作ログを削除
//   - 期限切れの kv_store を削除
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = createClient({ url, timeout: 10_000 });
const [logs, kv] = await client.batch(
  [
    "DELETE FROM action_logs WHERE created_at < unixepoch('now', '-6 months')",
    "DELETE FROM kv_store WHERE expires_at IS NOT NULL AND expires_at < unixepoch('now')",
  ],
  "write",
);
console.log(`deleted ${logs.rowsAffected} action_logs, ${kv.rowsAffected} kv_store rows`);
client.close();
