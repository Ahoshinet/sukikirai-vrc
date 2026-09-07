import type { Metadata } from "next";

import { CategoryPageView } from "../components/CategoryPageView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ユーザーランキング",
  description: "VRChatのユーザーを匿名で評価した、好き嫌いのランキングです。",
};

export default function Page() {
  return <CategoryPageView category="user" page={1} />;
}
