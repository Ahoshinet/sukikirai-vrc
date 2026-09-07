import type { Metadata } from "next";
import { TbInfoCircle } from "react-icons/tb";

import { ArticlePage } from "../components/ArticlePage";

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "VRChatで気になる物を見つけて、匿名で投票できるコミュニティサイトです。",
};

export default function Page() {
  return (
    <ArticlePage
      icon={<TbInfoCircle size={24} color="var(--mantine-color-brand-6)" />}
      title="このサイトについて"
      lead="VRChatで気になる物を見つけて、匿名で投票できるコミュニティサイトです。"
      sections={[
        {
          heading: "できること",
          list: [
            "ユーザー・アバター・ワールド・グループに「好き」「嫌い」で投票する",
            "投票の理由を匿名でコメントとして残す",
            "得票数や好き嫌いの比率をランキングとして見る",
          ],
        },
        {
          heading: "ログインと匿名性について",
          paragraphs: [
            "投票とコメントにはログインが必要です。多重投票や荒らしを防ぐための措置です。",
            "ログインしていても、投票者やコメント投稿者が誰であるかがサイト上に表示されることはありません。集計と表示は匿名で行われます。",
            "コメントには対象ごとに固定される匿名IDが表示されます。同じ人が連続して投稿しているかどうかは分かりますが、それが誰であるかは分かりません。IDは対象ごとに変わるため、別の対象での投稿と結び付けることもできません。",
            "ただし匿名であることは、何を書いてもよいということではありません。投稿内容には各自の責任が伴います。",
          ],
        },
        {
          heading: "掲載と削除について",
          paragraphs: [
            "ランキングに表示される評価やコメントは利用者による投稿です。運営者がその内容の真実性を保証するものではありません。",
            "ご本人またはその他の権利者からの削除依頼を受け付けています。申請内容と掲載内容を確認し、権利侵害のおそれや利用規約違反などに応じて必要な対応を行います。",
          ],
        },
      ]}
    />
  );
}
