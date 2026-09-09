"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { TbAlertTriangle, TbLock, TbRefresh } from "react-icons/tb";

import { formatDateTime } from "../lib/categories";
import { AdminReportActions } from "./AdminReportActions";

interface ReportRow {
  id: string;
  targetType: "entry" | "comment" | "site";
  reason: string;
  detail: string | null;
  contact: string | null;
  ip: string | null;
  createdAt: string;
  targetName: string | null;
  targetBody: string | null;
  targetHref: string | null;
}

const TARGET_LABEL: Record<ReportRow["targetType"], string> = {
  entry: "対象ページ",
  comment: "コメント",
  site: "お問い合わせ",
};

export function AdminReports() {
  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/reports");
      if (response.status === 403 || response.status === 401) {
        setDenied(true);
        setReports(null);
        return;
      }
      if (!response.ok) {
        setError(`読み込みに失敗しました。(${response.status})`);
        return;
      }
      const data = (await response.json()) as { reports: ReportRow[] };
      setReports(data.reports);
      setDenied(false);
    } catch {
      setError("読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (loading) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      </Card>
    );
  }

  if (denied) {
    return (
      <Alert color="gray" variant="light" icon={<TbLock size={18} />}>
        権限がありません。管理者の Discord アカウントでログインしてください。
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert
        color="kirai"
        variant="light"
        icon={<TbAlertTriangle size={18} />}
        title="読み込めませんでした"
      >
        <Stack gap="sm" align="flex-start">
          <Text size="sm">{error}</Text>
          <Button
            size="xs"
            variant="light"
            leftSection={<TbRefresh size={14} />}
            onClick={() => void load()}
          >
            再試行
          </Button>
        </Stack>
      </Alert>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Text size="sm" c="dimmed" ta="center">
          未対応の通報はありません。
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="sm">
      {reports.map((report) => (
        <Card key={report.id} withBorder radius="md" padding="md">
          <Stack gap="xs">
            <Group gap="xs" wrap="nowrap">
              <Badge size="sm" variant="light" color="brand">
                {report.reason}
              </Badge>
              <Badge size="sm" variant="light" color="gray">
                {TARGET_LABEL[report.targetType]}
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
              onDone={load}
            />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
