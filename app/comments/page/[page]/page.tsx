import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CommentsPageView } from "../../../components/CommentsPageView";

export const revalidate = 60;

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ page: "1" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `新着コメント ${page}ページ目`,
    description: "どの対象に新しくコメントが付いたかの一覧です。",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const parsed = Number.parseInt(page, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    notFound();
  }
  return <CommentsPageView page={parsed} />;
}
