import Link from "next/link";
import { Avatar, Badge, Group, Stack, Text, Title } from "@mantine/core";
import { TbSparkles } from "react-icons/tb";

import { CATEGORIES, entryHref, formatCount } from "../lib/categories";
import { recentlyVoted } from "../lib/queries";
import { CategoryIcon } from "./CategoryIcon";
import { HorizontalScroller } from "./HorizontalScroller";
import classes from "./RecentEntries.module.css";

export async function RecentEntries() {
  const entries = await recentlyVoted(12);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Stack gap="xs" component="section">
      <Group gap={8}>
        <Badge size="xs" variant="filled" color="brand">
          新着
        </Badge>
        <TbSparkles size={18} color="var(--mantine-color-brand-6)" />
        <Title order={2} size="h4">
          最近投票された
        </Title>
        <Text size="xs" c="dimmed" visibleFrom="xs">
          最終投票が新しい順
        </Text>
      </Group>

      <HorizontalScroller className={classes.scroller}>
        {entries.map((entry) => (
          <Link key={entry.id} href={entryHref(entry)} className={classes.card}>
            <Avatar
              size={56}
              radius="md"
              name={entry.name}
              color="initials"
              src={entry.imageUrl ? `/api/avatar/${entry.id}` : undefined}
            />
            <Text className={classes.name} lineClamp={1}>
              {entry.name}
            </Text>
            <Text className={classes.votes}>{formatCount(entry.total)}票</Text>
            <Group gap={3} className={classes.category}>
              <CategoryIcon category={entry.category} size={11} />
              <span>{CATEGORIES[entry.category].label}</span>
            </Group>
          </Link>
        ))}
      </HorizontalScroller>
    </Stack>
  );
}
