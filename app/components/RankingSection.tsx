import { Group, Stack, Text, Title } from "@mantine/core";

import { CATEGORIES, type CategoryKey } from "../lib/categories";
import { listEntries } from "../lib/queries";
import { CategoryIcon } from "./CategoryIcon";
import { MoreLink } from "./MoreLink";
import { RankingList } from "./RankingList";
import classes from "./RankingSection.module.css";

export async function RankingSection({
  category,
  limit = 5,
}: {
  category: CategoryKey;
  limit?: number;
}) {
  const meta = CATEGORIES[category];
  const { items, total } = await listEntries(category, limit, 0);

  return (
    <Stack gap="xs" component="section">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap={8} wrap="nowrap">
          <span className={classes.icon}>
            <CategoryIcon category={category} size={20} />
          </span>
          <Title order={2} size="h4">
            {meta.label}
          </Title>
          <Text size="xs" c="dimmed" visibleFrom="xs">
            上位{items.length}件
          </Text>
        </Group>

        <MoreLink href={`/${meta.segment}`}>
          すべて見る（{total}件）
        </MoreLink>
      </Group>

      <RankingList entries={items} />
    </Stack>
  );
}
