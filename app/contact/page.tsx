import type { Metadata } from "next";
import { Card } from "@mantine/core";
import { TbMail } from "react-icons/tb";

import { ContactForm } from "../components/ContactForm";
import { PageHeading, PageLayout } from "../components/PageLayout";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "削除依頼・違反報告・不具合報告の受付窓口です。",
};

export default function Page() {
  return (
    <PageLayout withSidebar={false}>
      <PageHeading
        icon={<TbMail size={24} color="var(--mantine-color-brand-6)" />}
        title="お問い合わせ"
        description="削除依頼・違反報告・不具合報告はこちらから受け付けています。"
      />

      <Card withBorder radius="md" padding="lg">
        <ContactForm />
      </Card>
    </PageLayout>
  );
}
