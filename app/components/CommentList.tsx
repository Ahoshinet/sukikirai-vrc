import Link from "next/link";
import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { TbChevronRight, TbThumbDown, TbThumbUp } from "react-icons/tb";

import {
  CATEGORIES,
  formatDateTime,
  type CommentSummary,
  type Stance,
} from "../lib/categories";
import { CategoryIcon } from "./CategoryIcon";
import classes from "./CommentList.module.css";

function StanceBadge({ stance }: { stance: Stance }) {
  const isSuki = stance === "suki";
  return (
    <Badge
      size="xs"
      variant="light"
      color={isSuki ? "brand" : "kirai"}
      leftSection={isSuki ? <TbThumbUp size={11} /> : <TbThumbDown size={11} />}
    >
      {isSuki ? "好き" : "嫌い"}
    </Badge>
  );
}

function href(comment: CommentSummary) {
  return `/${CATEGORIES[comment.entryCategory].segment}/${comment.entrySlug}`;
}

export function CommentList({ comments }: { comments: CommentSummary[] }) {
  if (comments.length === 0) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Text size="sm" c="dimmed" ta="center">
          まだコメントがありません。
        </Text>
      </Card>
    );
  }

  return (
    <Card padding={0} withBorder radius="md">
      {comments.map((comment) => (
        <Link key={comment.id} href={href(comment)} className={classes.item}>
          <StanceBadge stance={comment.stance} />
          <Badge
            size="xs"
            variant="light"
            color="gray"
            className={classes.category}
            leftSection={
              <CategoryIcon category={comment.entryCategory} size={11} />
            }
          >
            {CATEGORIES[comment.entryCategory].label}
          </Badge>
          <Text size="sm" fw={700} className={classes.target}>
            {comment.entryName}
          </Text>
          <Text size="xs" c="dimmed" className={classes.time}>
            {formatDateTime(comment.postedAt)}
          </Text>
          <TbChevronRight size={14} className={classes.chevron} />
        </Link>
      ))}
    </Card>
  );
}

export function CommentDigest({ comments }: { comments: CommentSummary[] }) {
  if (comments.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        まだコメントがありません。
      </Text>
    );
  }

  return (
    <Stack gap={6}>
      {comments.map((comment) => (
        <Link
          key={comment.id}
          href={href(comment)}
          className={classes.digestItem}
        >
          <StanceBadge stance={comment.stance} />
          <Text size="sm" fw={700} className={classes.target}>
            {comment.entryName}
          </Text>
          <Text size="xs" c="dimmed" className={classes.time}>
            {formatDateTime(comment.postedAt).slice(-5)}
          </Text>
        </Link>
      ))}
    </Stack>
  );
}

export function CommentListNote() {
  return (
    <Group gap={4} c="dimmed">
      <Text size="xs">
        コメント本文は、その対象に投票すると読めるようになります。
      </Text>
    </Group>
  );
}
