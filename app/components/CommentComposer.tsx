"use client";

import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Group, Stack, Text, Textarea } from "@mantine/core";
import { TbSend, TbThumbDown, TbThumbUp } from "react-icons/tb";

import type { Stance } from "../lib/categories";

const MAX_LENGTH = 400;

export function CommentComposer({
  stance,
  onSubmit,
}: {
  stance: Stance;
  onSubmit: (body: string) => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSuki = stance === "suki";
  const tooLong = body.length > MAX_LENGTH;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit(body.trim());
      setBody("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "投稿できませんでした。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card withBorder radius="md" padding="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="xs">
          <Group gap="xs">
            <Text size="sm" fw={700}>
              コメントを投稿
            </Text>
            <Badge
              size="xs"
              variant="light"
              color={isSuki ? "brand" : "kirai"}
              leftSection={
                isSuki ? <TbThumbUp size={11} /> : <TbThumbDown size={11} />
              }
            >
              {isSuki ? "好き" : "嫌い"}として投稿
            </Badge>
          </Group>

          <Textarea
            placeholder="どこが良かったか、合わなかったかを具体的に書いてください。"
            minRows={3}
            autosize
            value={body}
            onChange={(event) => setBody(event.currentTarget.value)}
            error={
              error ??
              (tooLong ? `${MAX_LENGTH}文字以内で入力してください。` : null)
            }
            aria-label="コメント本文"
          />

          <Group justify="space-between" align="center">
            <Text size="xs" c={tooLong ? "red" : "dimmed"}>
              {body.length} / {MAX_LENGTH}
            </Text>
            <Button
              type="submit"
              size="xs"
              loading={busy}
              leftSection={<TbSend size={14} />}
              disabled={body.trim() === "" || tooLong}
            >
              投稿する
            </Button>
          </Group>

          <Text size="xs" c="dimmed">
            投稿者が誰であるかは公開されません。ガイドラインに反する内容は削除されることがあります。
          </Text>
        </Stack>
      </form>
    </Card>
  );
}
