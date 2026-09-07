import type { Metadata } from "next";
import { Card } from "@mantine/core";
import { TbLogin } from "react-icons/tb";

import { LoginPanel } from "../components/LoginPanel";
import { PageHeading, PageLayout } from "../components/PageLayout";

export const metadata: Metadata = {
  title: "ログイン",
  description: "投票とコメントの投稿にはログインが必要です。",
};

export default function Page() {
  return (
    <PageLayout withSidebar={false}>
      <PageHeading
        icon={<TbLogin size={24} color="var(--mantine-color-brand-6)" />}
        title="ログイン"
        description="投票とコメントの投稿にはログインが必要です。投票者が公開されることはありません。"
      />
      <Card withBorder radius="md" padding="lg">
        <LoginPanel />
      </Card>
    </PageLayout>
  );
}
