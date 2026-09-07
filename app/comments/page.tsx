import type { Metadata } from "next";

import { CommentsPageView } from "../components/CommentsPageView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "新着コメント",
  description: "どの対象に新しくコメントが付いたかの一覧です。",
};

export default function Page() {
  return <CommentsPageView page={1} />;
}
