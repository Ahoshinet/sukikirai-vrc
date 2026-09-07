"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Group } from "@mantine/core";
import { TbEyeOff, TbExternalLink, TbX } from "react-icons/tb";

export function AdminReportActions({
  reportId,
  href,
}: {
  reportId: string;
  href: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const send = async (action: "hide" | "reject") => {
    setBusy(true);
    await fetch("/api/admin/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reportId, action }),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <Group gap="xs" justify="flex-end">
      {href && (
        <Button
          component="a"
          href={href}
          target="_blank"
          size="xs"
          variant="subtle"
          color="gray"
          leftSection={<TbExternalLink size={14} />}
        >
          対象を開く
        </Button>
      )}
      <Button
        size="xs"
        variant="subtle"
        color="gray"
        loading={busy}
        leftSection={<TbX size={14} />}
        onClick={() => send("reject")}
      >
        対応不要
      </Button>
      <Button
        size="xs"
        color="kirai"
        loading={busy}
        leftSection={<TbEyeOff size={14} />}
        onClick={() => send("hide")}
      >
        非表示にする
      </Button>
    </Group>
  );
}
