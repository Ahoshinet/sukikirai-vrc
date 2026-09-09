import type { Metadata } from "next";
import { TbShieldCheck } from "react-icons/tb";

import { AdminReports } from "../components/AdminReports";
import { PageHeading, PageLayout } from "../components/PageLayout";

export const metadata: Metadata = {
  title: "通報管理",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PageLayout withSidebar={false}>
      <PageHeading
        icon={<TbShieldCheck size={24} color="var(--mantine-color-brand-6)" />}
        title="通報管理"
        description="未対応の通報・削除依頼の一覧です。"
      />
      <AdminReports />
    </PageLayout>
  );
}
