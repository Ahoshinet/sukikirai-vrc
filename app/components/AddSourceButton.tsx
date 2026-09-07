"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbCheck, TbPlus } from "react-icons/tb";

import type { EntrySource } from "../lib/categories";
import { SOURCE_LABELS } from "../lib/entry-source";

export function AddSourceButton({
  entryId,
  sources,
}: {
  entryId: string;
  sources: EntrySource[];
}) {
  const router = useRouter();
  const [opened, handlers] = useDisclosure(false);
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conflictHref, setConflictHref] = useState<string | null>(null);

  const known = sources.map((source) => SOURCE_LABELS[source.source]);
  const missing = (["x", "vrchat", "booth"] as const)
    .filter((source) => !sources.some((item) => item.source === source))
    .map((source) => SOURCE_LABELS[source]);

  const close = () => {
    handlers.close();
    setReference("");
    setDone(null);
    setError(null);
    setConflictHref(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setConflictHref(null);

    const response = await fetch(`/api/entries/${entryId}/sources`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      href?: string;
      iconChanged?: boolean;
    };

    if (!response.ok) {
      setError(data.error ?? "追加できませんでした。");
      setConflictHref(data.href ?? null);
      setBusy(false);
      return;
    }

    setDone(
      data.iconChanged
        ? "情報を追加しました。アイコンをXのものに変更しました。"
        : "情報を追加しました。",
    );
    setBusy(false);
    router.refresh();
  };

  return (
    <>
      <Tooltip label="情報の追加">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          aria-label="情報の追加"
          onClick={handlers.open}
        >
          <TbPlus size={18} />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={close} title="情報の追加" radius="md">
        {done ? (
          <Stack gap="sm">
            <Alert color="brand" variant="light" icon={<TbCheck size={18} />}>
              {done}
            </Alert>
            <Button onClick={close}>閉じる</Button>
          </Stack>
        ) : (
          <form onSubmit={submit}>
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                同じ対象の別のリンクを追加すると、ひとつのページにまとめられます。
                {known.length > 0 && `登録済み: ${known.join("・")}。`}
                {missing.length > 0 && `追加できるもの: ${missing.join("・")}。`}
              </Text>
              <TextInput
                label="リンク"
                placeholder="https://x.com/... / https://vrchat.com/home/user/usr_... / https://booth.pm/ja/items/..."
                value={reference}
                onChange={(event) => setReference(event.currentTarget.value)}
                error={error}
                required
              />
              {conflictHref && (
                <Anchor href={conflictHref} size="xs">
                  登録済みのページを開く
                </Anchor>
              )}
              <Group justify="flex-end">
                <Button
                  type="submit"
                  loading={busy}
                  disabled={reference.trim() === ""}
                  leftSection={<TbPlus size={16} />}
                >
                  追加する
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>
    </>
  );
}
