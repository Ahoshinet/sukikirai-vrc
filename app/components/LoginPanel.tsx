"use client";

import { useState } from "react";
import { Alert, Anchor, Button, Divider, Stack, Text } from "@mantine/core";
import { TbBrandDiscord, TbInfoCircle } from "react-icons/tb";

import { authClient } from "../lib/auth-client";

export function LoginPanel() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    const result = await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
    if (result.error) {
      setError(result.error.message ?? "ログインを開始できませんでした。");
      setBusy(false);
    }
  };

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Discordのアカウントでログインします。VRChatのアカウント情報を入力する必要はありません。
      </Text>

      <Button
        size="md"
        color="indigo"
        leftSection={<TbBrandDiscord size={18} />}
        loading={busy}
        onClick={() => void signIn()}
      >
        Discordでログイン
      </Button>

      {error && (
        <Alert
          color="brand"
          variant="light"
          icon={<TbInfoCircle size={18} />}
          title="ログインできませんでした"
        >
          {error}
        </Alert>
      )}

      <Text size="xs" c="dimmed">
        ログインすると
        <Anchor href="/terms" size="xs">
          利用規約
        </Anchor>
        ・
        <Anchor href="/privacy" size="xs">
          プライバシーポリシー
        </Anchor>
        ・
        <Anchor href="/guidelines" size="xs">
          ガイドライン
        </Anchor>
        に同意したものとみなされます。
      </Text>

      <Divider />

      <Text size="xs" c="dimmed" ta="center">
        投票したい相手がまだ掲載されていない場合は{" "}
        <Anchor href="/register" size="xs">
          新しい投票ページを作成
        </Anchor>
        できます。
      </Text>
    </Stack>
  );
}
