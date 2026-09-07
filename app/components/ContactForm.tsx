"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { TbCheck, TbSend } from "react-icons/tb";

const TOPICS = [
  "掲載内容の削除依頼",
  "ガイドライン違反の報告",
  "不具合の報告",
  "その他",
];

export function ContactForm() {
  const [reason, setReason] = useState<string | null>(null);
  const [target, setTarget] = useState("");
  const [detail, setDetail] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        targetType: "site",
        reason,
        detail: target ? `対象: ${target}\n\n${detail}` : detail,
        contact,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? "送信できませんでした。");
      setBusy(false);
      return;
    }

    setSent(true);
    setBusy(false);
  };

  if (sent) {
    return (
      <Alert color="brand" variant="light" icon={<TbCheck size={18} />}>
        お問い合わせを受け付けました。内容を確認のうえ対応します。
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Select
          label="お問い合わせ種別"
          placeholder="選択してください"
          data={TOPICS}
          value={reason}
          onChange={setReason}
          required
        />
        <TextInput
          label="対象のページ・名称"
          placeholder="削除依頼の場合は対象ページのURLをご記入ください"
          value={target}
          onChange={(event) => setTarget(event.currentTarget.value)}
        />
        <Textarea
          label="内容"
          placeholder="できるだけ具体的にご記入ください。"
          minRows={6}
          autosize
          value={detail}
          onChange={(event) => setDetail(event.currentTarget.value)}
          error={error}
          required
        />
        <TextInput
          label="返信先（任意）"
          placeholder="返信が必要な場合のみご記入ください"
          description="未記入でも送信できます。"
          value={contact}
          onChange={(event) => setContact(event.currentTarget.value)}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={busy}
            leftSection={<TbSend size={16} />}
            disabled={reason === null || detail.trim() === ""}
          >
            送信する
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
