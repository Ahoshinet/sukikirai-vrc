import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RankingPageView } from "../../../components/RankingPageView";

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
    title: `総合ランキング ${page}ページ目`,
    description:
      "ユーザー・アバター・ワールド・グループを横断した、得票数順のランキングです。",
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
  return <RankingPageView page={parsed} />;
}
