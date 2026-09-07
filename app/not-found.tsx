import type { Metadata } from "next";
import { Button, Card, Stack, Text, Title } from "@mantine/core";
import { TbAlertTriangle } from "react-icons/tb";

import { PageLayout } from "./components/PageLayout";

export const metadata: Metadata = {
  title: "ページが見つかりません",
};

export default function NotFound() {
  return (
    <PageLayout withSidebar={false}>
      <Card withBorder radius="md" padding="xl">
        <Stack gap="sm" align="center">
          <TbAlertTriangle size={40} color="var(--mantine-color-brand-6)" />
          <Title order={1} size="h3">
            ページが見つかりませんでした
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            URLが間違っているか、対象が削除された可能性があります。
          </Text>
          <Button component="a" href="/" mt="sm">
            ホームへ戻る
          </Button>
        </Stack>
      </Card>
    </PageLayout>
  );
}
