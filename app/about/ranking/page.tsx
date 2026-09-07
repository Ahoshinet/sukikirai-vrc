import type { Metadata } from "next";
import { TbChartBar } from "react-icons/tb";

import { ArticlePage } from "../../components/ArticlePage";

export const metadata: Metadata = {
  title: "ランキングの仕組み",
  description: "ランキングの並び順と集計方法について説明します。",
};

export default function Page() {
  return (
    <ArticlePage
      icon={<TbChartBar size={24} color="var(--mantine-color-brand-6)" />}
      title="ランキングの仕組み"
      lead="並び順と集計方法について説明します。"
      sections={[
        {
          heading: "並び順",
          paragraphs: [
            "ランキングは「好き」と「嫌い」を合計した総得票数の多い順に並びます。好き嫌いのどちらに寄っているかは順位に影響しません。",
            "総得票数が同じ場合は、内部の識別子順で並びを固定しています。表示のたびに順位が入れ替わることはありません。",
          ],
        },
        {
          heading: "比率バーの読み方",
          list: [
            "バーの左側（ピンク）が「好き」の割合です",
            "バーの右側（青）が「嫌い」の割合です",
            "まだ投票が1件もない場合は、中立として50%ずつで表示します",
          ],
        },
        {
          heading: "結果が見られるタイミング",
          paragraphs: [
            "好き嫌いの割合とコメントは、その対象に投票したあとに表示されます。総投票数とコメント数は投票前でも確認できます。",
            "投票は取り消しや変更ができます。取り消すと結果は再び非表示になります。",
          ],
        },
      ]}
    />
  );
}
