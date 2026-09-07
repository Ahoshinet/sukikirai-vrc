import type { Metadata } from "next";

import { RankingPageView } from "../components/RankingPageView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "総合ランキング",
  description:
    "ユーザー・アバター・ワールド・グループを横断した、得票数順のランキングです。",
};

export default function Page() {
  return <RankingPageView page={1} />;
}
