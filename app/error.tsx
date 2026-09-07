"use client";

import Link from "next/link";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { TbAlertTriangle, TbRefresh } from "react-icons/tb";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Card withBorder radius="md" padding="xl" maw={560} mx="auto" my="xl">
      <Stack gap="md" align="center">
        <TbAlertTriangle size={32} color="var(--mantine-color-kirai-6)" />
        <Stack gap={4} align="center">
          <Title order={1} size="h4">
            問題が発生しました
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            一時的な不具合の可能性があります。読み込み直しても直らない場合は、お問い合わせからご連絡ください。
          </Text>
        </Stack>
        <Group gap="sm">
          <Button
            variant="light"
            leftSection={<TbRefresh size={16} />}
            onClick={reset}
          >
            再読み込み
          </Button>
          <Button component={Link} href="/" variant="subtle" color="gray">
            ホームへ戻る
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
