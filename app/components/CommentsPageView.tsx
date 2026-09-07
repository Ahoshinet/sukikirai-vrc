import { Stack, Text } from "@mantine/core";
import { TbMessageCircle } from "react-icons/tb";

import { recentComments } from "../lib/queries";
import { CommentList, CommentListNote } from "./CommentList";
import { PageHeading, PageLayout } from "./PageLayout";
import { PaginationNav } from "./PaginationNav";

export const COMMENTS_PAGE_SIZE = 20;

export async function CommentsPageView({ page }: { page: number }) {
  const offset = (page - 1) * COMMENTS_PAGE_SIZE;
  const { items, total } = await recentComments(COMMENTS_PAGE_SIZE, offset);
  const totalPages = Math.max(1, Math.ceil(total / COMMENTS_PAGE_SIZE));

  return (
    <PageLayout>
      <PageHeading
        icon={<TbMessageCircle size={24} color="var(--mantine-color-brand-6)" />}
        title="新着コメント"
        description="どの対象に新しくコメントが付いたかを新しい順に表示しています。"
        meta={
          <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
            {total}件
          </Text>
        }
      />
      <Stack gap="xs">
        <CommentListNote />
        <CommentList comments={items} />
      </Stack>
      <PaginationNav
        basePath="/comments"
        page={page}
        totalPages={totalPages}
        from={total === 0 ? 0 : offset + 1}
        to={Math.min(offset + COMMENTS_PAGE_SIZE, total)}
        total={total}
      />
    </PageLayout>
  );
}
