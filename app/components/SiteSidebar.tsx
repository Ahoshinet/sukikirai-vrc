import Link from "next/link";
import { Box, Card, Group, Stack, Text, Title } from "@mantine/core";
import { TbInfoCircle, TbMessageCircle } from "react-icons/tb";

import { CATEGORIES, CATEGORY_KEYS } from "../lib/categories";
import { listEntries, recentComments } from "../lib/queries";
import { CategoryIcon } from "./CategoryIcon";
import { CommentDigest } from "./CommentList";
import { MoreLink } from "./MoreLink";
import classes from "./SiteSidebar.module.css";

export async function SiteSidebar() {
  const [comments, ...counts] = await Promise.all([
    recentComments(5, 0),
    ...CATEGORY_KEYS.map((key) => listEntries(key, 1, 0)),
  ]);

  return (
    <Stack gap="lg">
      <Card withBorder radius="md" padding="md">
        <Group gap={6} mb="sm">
          <TbMessageCircle size={18} />
          <Title order={2} size="h5">
            新着コメント
          </Title>
        </Group>
        <CommentDigest comments={comments.items} />
        <Box mt="sm">
          <MoreLink href="/comments">すべて見る</MoreLink>
        </Box>
      </Card>

      <Card withBorder radius="md" padding="md">
        <Title order={2} size="h5" mb="sm">
          カテゴリ
        </Title>
        <Stack gap={2}>
          {CATEGORY_KEYS.map((key, index) => {
            const category = CATEGORIES[key];
            return (
              <Link
                key={key}
                href={`/${category.segment}`}
                className={classes.categoryLink}
              >
                <CategoryIcon category={key} size={16} />
                <span>{category.label}</span>
                <Text size="xs" c="dimmed" ml="auto">
                  {counts[index]?.total ?? 0}
                </Text>
              </Link>
            );
          })}
        </Stack>
      </Card>

      <Card withBorder radius="md" padding="md">
        <Group gap={6} mb="xs">
          <TbInfoCircle size={18} />
          <Title order={2} size="h5">
            このサイトについて
          </Title>
        </Group>
        <Text size="sm" c="dimmed">
          VRChatで気になる物を見つけて、匿名で投票できるコミュニティサイトです。
        </Text>
        <Box mt="sm">
          <MoreLink href="/about">詳しく見る</MoreLink>
        </Box>
      </Card>
    </Stack>
  );
}
