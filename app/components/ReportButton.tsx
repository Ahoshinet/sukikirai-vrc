"use client";

import { useState, type FormEvent } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbCheck, TbFlag } from "react-icons/tb";

const REASONS = [
  "掲載内容の削除依頼",
  "ガイドライン違反の報告",
  "不具合の報告",
  "その他",
];

export function ReportButton({
  targetType,
  targetId,
  compact = false,
}: {
  targetType: "entry" | "comment";
  targetId: string;
  compact?: boolean;
}) {
  const [opened, handlers] = useDisclosure(false);
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetType, targetId, reason, detail, contact }),
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

  const label =
    targetType === "comment" ? "このコメントを通報する" : "この掲載を通報する";

  return (
    <>
      {compact ? (
        <Button
          variant="subtle"
          color="gray"
          size="compact-xs"
          fw={700}
          leftSection={<TbFlag size={13} />}
          aria-label={label}
          title={label}
          onClick={handlers.open}
        >
          通報
        </Button>
      ) : (
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          aria-label={label}
          title={label}
          onClick={handlers.open}
        >
          <TbFlag size={18} />
        </ActionIcon>
      )}

      <Modal
        opened={opened}
        onClose={handlers.close}
        title={targetType === "comment" ? "コメントの通報" : "通報・削除依頼"}
        radius="md"
      >
        {sent ? (
          <Stack gap="sm">
            <Alert color="brand" variant="light" icon={<TbCheck size={18} />}>
              受け付けました。内容を確認のうえ対応します。
            </Alert>
            <Button onClick={handlers.close}>閉じる</Button>
          </Stack>
        ) : (
          <form onSubmit={submit}>
            <Stack gap="md">
              <Select
                label="種別"
                placeholder="選択してください"
                data={REASONS}
                value={reason}
                onChange={setReason}
                required
              />
              <Textarea
                label="内容"
                placeholder="具体的にご記入ください。"
                minRows={4}
                autosize
                value={detail}
                onChange={(event) => setDetail(event.currentTarget.value)}
              />
              <TextInput
                label="返信先（任意）"
                placeholder="ご本人からの依頼の場合はご記入ください"
                value={contact}
                onChange={(event) => setContact(event.currentTarget.value)}
              />
              {error && (
                <Text size="xs" c="red">
                  {error}
                </Text>
              )}
              <Group justify="flex-end">
                <Button
                  type="submit"
                  loading={busy}
                  disabled={reason === null}
                  leftSection={<TbFlag size={16} />}
                >
                  送信する
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>
    </>
  );
}
