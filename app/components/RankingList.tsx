import { Card, Text } from "@mantine/core";

import type { Entry } from "../lib/categories";
import { RankingCard } from "./RankingCard";

export function RankingList({
  entries,
  startRank = 1,
}: {
  entries: Entry[];
  startRank?: number;
}) {
  if (entries.length === 0) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Text size="sm" c="dimmed" ta="center">
          まだ登録がありません。
        </Text>
      </Card>
    );
  }

  return (
    <Card padding={0} withBorder radius="md">
      {entries.map((entry, index) => (
        <RankingCard key={entry.id} entry={entry} rank={startRank + index} />
      ))}
    </Card>
  );
}
