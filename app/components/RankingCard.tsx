import Link from "next/link";
import { Avatar, Badge, Group, Text } from "@mantine/core";
import { TbMessageCircle, TbUsers } from "react-icons/tb";

import {
  CATEGORIES,
  entryHref,
  formatCount,
  type Entry,
} from "../lib/categories";
import { CategoryIcon } from "./CategoryIcon";
import classes from "./RankingCard.module.css";

export function RankingCard({ entry, rank }: { entry: Entry; rank: number }) {
  return (
    <article className={classes.root}>
      <div className={classes.rank} data-top={rank <= 3 || undefined}>
        {rank}
      </div>

      <Avatar
        size={48}
        radius="md"
        name={entry.name}
        color="initials"
        src={entry.imageUrl ? `/api/avatar/${entry.id}` : undefined}
      />

      <div className={classes.body}>
        <Group gap="xs" wrap="nowrap">
          <Badge
            size="xs"
            variant="light"
            color="gray"
            className={classes.category}
            leftSection={<CategoryIcon category={entry.category} size={11} />}
          >
            {CATEGORIES[entry.category].label}
          </Badge>
          <Link href={entryHref(entry)} className={classes.name}>
            {entry.name}
          </Link>
        </Group>

        <Group gap="md" mt={6}>
          <Group gap={4} c="dimmed">
            <TbUsers size={14} />
            <Text size="xs" className={classes.votes} fw={700}>
              {formatCount(entry.total)}票
            </Text>
          </Group>
          <Group gap={4} c="dimmed">
            <TbMessageCircle size={14} />
            <Text size="xs" c="dimmed">
              {formatCount(entry.comments)}
            </Text>
          </Group>
        </Group>
      </div>
    </article>
  );
}
