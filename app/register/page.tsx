import type { Metadata } from "next";
import { Card } from "@mantine/core";
import { TbPlus } from "react-icons/tb";

import { PageHeading, PageLayout } from "../components/PageLayout";
import { RegisterEntryForm } from "../components/RegisterEntryForm";

export const metadata: Metadata = {
  title: "新しい投票ページ",
  description:
    "まだ掲載されていない相手の投票ページを作成できます。X・VRChat・BOOTH のURLから表示名を取得します。",
};

export default function Page() {
  return (
    <PageLayout withSidebar={false}>
      <PageHeading
        icon={<TbPlus size={24} color="var(--mantine-color-brand-6)" />}
        title="新しい投票ページ"
        description="まだ掲載されていない相手の投票ページを作成できます。"
      />
      <Card withBorder radius="md" padding="lg">
        <RegisterEntryForm />
      </Card>
    </PageLayout>
  );
}
