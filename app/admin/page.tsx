import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { TbShieldCheck } from "react-icons/tb";

import { AdminReportActions } from "../components/AdminReportActions";
import { PageHeading, PageLayout } from "../components/PageLayout";
import { getAdminUser, listReports } from "../lib/admin";
import { formatDateTime } from "../lib/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "通報管理",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const admin = await getAdminUser();
  if (!admin) {
    notFound();
  }

  const open = await listReports("open");

  return (
    <PageLayout withSidebar={false}>
      <PageHeading
        icon={<TbShieldCheck size={24} color="var(--mantine-color-brand-6)" />}
        title="通報管理"
        description="未対応の通報・削除依頼の一覧です。"
      />

      {open.length === 0 ? (
        <Card withBorder radius="md" padding="xl">
          <Text size="sm" c="dimmed" ta="center">
            未対応の通報はありません。
          </Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {open.map((report) => (
            <Card key={report.id} withBorder radius="md" padding="md">
              <Stack gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <Badge size="sm" variant="light" color="brand">
                    {report.reason}
                  </Badge>
                  <Badge size="sm" variant="light" color="gray">
                    {report.targetType === "entry"
                      ? "対象ページ"
                      : report.targetType === "comment"
                        ? "コメント"
                        : "お問い合わせ"}
                  </Badge>
                  <Text size="xs" c="dimmed" ml="auto">
                    {formatDateTime(report.createdAt)}
                  </Text>
                </Group>

                {report.targetName && (
                  <Text size="sm" fw={700}>
                    {report.targetName}
                  </Text>
                )}
                {report.targetBody && (
                  <Text size="sm" c="dimmed">
                    {report.targetBody}
                  </Text>
                )}
                {report.detail && <Text size="sm">{report.detail}</Text>}

                <Group gap="md">
                  {report.contact && (
                    <Text size="xs" c="dimmed">
                      返信先: {report.contact}
                    </Text>
                  )}
                  <Text size="xs" c="dimmed">
                    IP: {report.ip ?? "-"}
                  </Text>
                </Group>

                <AdminReportActions
                  reportId={report.id}
                  href={report.targetHref}
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </PageLayout>
  );
}
