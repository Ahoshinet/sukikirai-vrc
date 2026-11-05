# VPS（ConoHa）での運用

Next.js の standalone 出力を systemd で動かし、nginx をリバースプロキシにする。DB は同じマシン上の SQLite（libsql）。

```
Cloudflare（プロキシ）→ nginx :443 → node server.js :3000 → /var/lib/sukikiraivrc/sukikirai.db
```

## 初回セットアップ

Ubuntu 24.04 を想定している。

```sh
# Node.js（.nvmrc と同じメジャーバージョン）と nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs nginx rsync

# 実行ユーザー兼デプロイユーザー
sudo useradd --system --create-home --shell /bin/bash sukikiraivrc
sudo install -d -o sukikiraivrc -g sukikiraivrc /opt/sukikiraivrc/releases /var/lib/sukikiraivrc
sudo install -d -m 750 -o root -g sukikiraivrc /etc/sukikiraivrc

# 環境変数（.env.example を参考に埋める。値は Cloudflare に入れていたものと同じにすること）
sudo install -m 640 -o root -g sukikiraivrc /dev/null /etc/sukikiraivrc/env
sudoedit /etc/sukikiraivrc/env

# systemd
sudo cp deploy/sukikiraivrc.service deploy/sukikiraivrc-cleanup.service deploy/sukikiraivrc-cleanup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable sukikiraivrc sukikiraivrc-cleanup.timer

# デプロイユーザーに再起動だけ許可する
echo 'sukikiraivrc ALL=(root) NOPASSWD: /usr/bin/systemctl restart sukikiraivrc, /usr/bin/journalctl -u sukikiraivrc *' \
  | sudo tee /etc/sudoers.d/sukikiraivrc && sudo chmod 440 /etc/sudoers.d/sukikiraivrc

# nginx（証明書のパスは環境に合わせて書き換える）
sudo cp deploy/nginx.conf /etc/nginx/sites-available/sukikiraivrc
sudo ln -s /etc/nginx/sites-available/sukikiraivrc /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

`/etc/sukikiraivrc/env` には少なくとも次を入れる。

```
DATABASE_URL=file:/var/lib/sukikiraivrc/sukikirai.db
SITE_URL=https://sukikiraivrc.com
BETTER_AUTH_SECRET=...
ANON_ID_SALT=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```

> `BETTER_AUTH_SECRET` と `ANON_ID_SALT` は Cloudflare で使っていた値をそのまま使うこと。変わると全員がログアウトされ、過去コメントの匿名IDもすべて変わる。

### ファイアウォール

前段に Cloudflare を置く場合、`cf-connecting-ip` を偽装されないよう 80/443 は Cloudflare の IP 帯からだけ受け付ける（ConoHa のセキュリティグループか ufw で設定する）。SSH は別途制限する。

## GitHub Actions のシークレット

`production` environment に登録する。

| 名前 | 内容 |
| --- | --- |
| `VPS_HOST` | VPS のホスト名または IP |
| `VPS_USER` | `sukikiraivrc` |
| `VPS_PORT` | SSH ポート（省略時 22） |
| `VPS_SSH_KEY` | デプロイ用秘密鍵（公開鍵は `~sukikiraivrc/.ssh/authorized_keys` に置く） |
| `VPS_KNOWN_HOSTS` | `ssh-keyscan -p <port> <host>` の出力 |

`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` は不要になる。

## D1 からのデータ移行（一度だけ）

1. メンテナンス中にして書き込みを止める
2. 手元で D1 をエクスポートする

   ```sh
   pnpm dlx wrangler d1 export sukikirai-vrc --remote --output d1.sql
   ```

3. 一度デプロイしてリリースを VPS に置いたあと、サービスを止めて取り込む

   ```sh
   sudo systemctl stop sukikiraivrc
   rm -f /var/lib/sukikiraivrc/sukikirai.db*   # 初回起動で作られた空のDBを消す
   cd /opt/sukikiraivrc/current
   DATABASE_URL=file:/var/lib/sukikiraivrc/sukikirai.db node scripts/import-d1.mjs ~/d1.sql
   sudo systemctl start sukikiraivrc   # 未適用のマイグレーション（kv_store）が流れる
   ```

4. DNS（Cloudflare）のオリジンを VPS に向け、動作を確認してから Workers を止める

VRChat の認証 Cookie は移行しない。初回アクセス時に再ログインされる。

## バックアップ

D1 の Time Travel に相当するものは無いので、SQLite を定期的に退避する。WAL モードなので `cp` ではなくオンラインバックアップを使う。

```sh
sqlite3 /var/lib/sukikiraivrc/sukikirai.db ".backup '/var/backups/sukikirai-$(date +%F).db'"
```

ConoHa のオブジェクトストレージなどマシン外に置くか、Litestream で継続的にレプリケーションすることを勧める。

## 運用コマンド

```sh
journalctl -u sukikiraivrc -f                 # ログ
systemctl list-timers sukikiraivrc-cleanup    # 次回のクリーンアップ
ls -l /opt/sukikiraivrc/current               # 稼働中のリリース
```

ロールバックは `current` のリンク先を `releases/` 内の別のディレクトリに付け替えて再起動する。
