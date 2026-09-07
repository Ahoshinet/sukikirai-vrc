"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { TbInfoCircle, TbLink, TbLock } from "react-icons/tb";

import { CATEGORIES } from "../lib/categories";
import {
  SOURCE_LABELS,
  parseEntryRef,
  validateEntryRef,
  type ParsedEntryRef,
} from "../lib/entry-source";

interface Notice {
  kind: "login" | "duplicate" | "failed";
  message: string;
  href?: string;
}

export function RegisterEntryForm() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedEntryRef | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const onChange = (value: string) => {
    setReference(value);
    setError(null);
    setNotice(null);
    setParsed(value.trim() === "" ? null : parseEntryRef(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = validateEntryRef(reference);
    setError(message);
    if (message !== null) {
      return;
    }

    setBusy(true);
    setNotice(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      href?: string;
      error?: string;
    };

    if (response.ok && data.href) {
      router.push(data.href);
      return;
    }

    setBusy(false);
    if (response.status === 401) {
      setNotice({
        kind: "login",
        message: data.error ?? "登録にはログインが必要です。",
      });
    } else if (response.status === 409) {
      setNotice({
        kind: "duplicate",
        message: data.error ?? "すでに登録されています。",
        href: data.href,
      });
    } else {
      setNotice({
        kind: "failed",
        message: data.error ?? "登録できませんでした。",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          X・VRChat・BOOTH のいずれかのURLを貼り付けると、その表示名で投票ページが作られます。
        </Text>

        <Stack gap={6}>
          <TextInput
            label="X / VRChat / BOOTH のURL または ID"
            placeholder="https://vrchat.com/home/user/usr_... / https://x.com/example / @example"
            leftSection={<TbLink size={15} />}
            value={reference}
            error={error}
            onChange={(event) => onChange(event.currentTarget.value)}
            required
          />
          <Text size="xs" c="dimmed">
            XはURL・@ID・IDのみ、VRChatはURLまたは
            <code>usr_</code>
            などのID、BOOTHは商品ページのURLに対応しています。
          </Text>
        </Stack>

        {parsed && (
          <Group gap="xs">
            <Badge variant="light" color="brand">
              {SOURCE_LABELS[parsed.source]}として認識
            </Badge>
            {parsed.category && (
              <Badge variant="light" color="gray">
                カテゴリ: {CATEGORIES[parsed.category].label}
              </Badge>
            )}
          </Group>
        )}

        {notice && (
          <Alert
            color="brand"
            variant="light"
            icon={
              notice.kind === "login" ? (
                <TbLock size={18} />
              ) : (
                <TbInfoCircle size={18} />
              )
            }
          >
            <Stack gap="xs">
              <Text size="sm">{notice.message}</Text>
              {notice.kind === "login" && (
                <Button
                  component="a"
                  href="/login"
                  size="xs"
                  variant="light"
                  w="fit-content"
                >
                  ログインする
                </Button>
              )}
              {notice.href && (
                <Button
                  component="a"
                  href={notice.href}
                  size="xs"
                  variant="light"
                  w="fit-content"
                >
                  登録済みのページを見る
                </Button>
              )}
            </Stack>
          </Alert>
        )}

        <Button type="submit" size="md" fullWidth loading={busy}>
          登録してページを作る
        </Button>

        <Text size="xs" c="dimmed">
          誹謗中傷、なりすまし、虚偽情報の登録はおやめください。本人その他の権利者から削除申請があった場合は、申請内容と掲載内容を確認し、権利侵害のおそれや利用規約違反などに応じて必要な対応を行います。
        </Text>
      </Stack>
    </form>
  );
}
