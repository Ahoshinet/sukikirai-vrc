import { Group, Stack, Text } from "@mantine/core";
import { TbChartBar } from "react-icons/tb";

import { formatCount, type VoteTrendPoint } from "../lib/categories";
import classes from "./VoteTrend.module.css";

const HOUR = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  hour12: false,
});

function hourLabel(iso: string): string {
  return HOUR.format(new Date(iso)).replace(/[^0-9]/g, "");
}

export function VoteTrend({ points }: { points: VoteTrendPoint[] }) {
  const totals = points.map((point) => point.suki + point.kirai);
  const peak = Math.max(1, ...totals);
  const sum = totals.reduce((carry, value) => carry + value, 0);

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="baseline" wrap="nowrap">
        <Group gap={6}>
          <TbChartBar size={16} />
          <Text size="sm" fw={700}>
            投票数の推移
          </Text>
          <Text size="xs" c="dimmed">
            過去24時間・1時間ごと
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          この24時間で {formatCount(sum)}票
        </Text>
      </Group>

      {sum === 0 ? (
        <Text size="xs" c="dimmed" className={classes.empty}>
          この24時間の投票はありません。
        </Text>
      ) : (
        <div className={classes.chart}>
          {points.map((point) => {
            const label = hourLabel(point.hour);
            const total = point.suki + point.kirai;
            return (
              <div
                key={point.hour}
                className={classes.column}
                title={`${label}時台 好き${point.suki} / 嫌い${point.kirai}`}
              >
                <div className={classes.track}>
                  <div
                    className={classes.kirai}
                    style={{ height: `${(point.kirai / peak) * 100}%` }}
                  />
                  <div
                    className={classes.suki}
                    style={{ height: `${(point.suki / peak) * 100}%` }}
                  />
                </div>
                <span
                  className={classes.tick}
                  data-show={Number(label) % 6 === 0 || undefined}
                >
                  {label}
                </span>
                <span className={classes.srOnly}>{total}票</span>
              </div>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
