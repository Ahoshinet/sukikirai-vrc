import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPageView } from "../../../components/CategoryPageView";

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
    title: `グループランキング ${page}ページ目`,
    description: "VRChatのグループを匿名で評価した、好き嫌いのランキングです。",
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
  return <CategoryPageView category="group" page={parsed} />;
}
