import type { Metadata } from "next";
import { TbAlertTriangle } from "react-icons/tb";

import { ArticlePage } from "../components/ArticlePage";

export const metadata: Metadata = {
  title: "ガイドライン",
  description: "投稿にあたって守っていただきたい内容をまとめています。",
};

export default function Page() {
  return (
    <ArticlePage
      icon={<TbAlertTriangle size={24} color="var(--mantine-color-brand-6)" />}
      title="ガイドライン"
      lead="投稿にあたって守っていただきたい内容をまとめています。"
      sections={[
        {
          heading: "投稿してよいこと",
          list: [
            "実際に見聞きした範囲での感想",
            "どこが良かったか、合わなかったかという具体的な内容",
            "他の人が参考にできる情報",
          ],
        },
        {
          heading: "投稿しないでください",
          list: [
            "特定の個人を攻撃する目的の書き込み",
            "本名・住所・連絡先など、個人を特定できる情報",
            "事実と異なる内容を事実であるかのように書くこと",
            "同じ内容の繰り返し投稿",
          ],
        },
        {
          heading: "対応について",
          paragraphs: [
            "ガイドラインに反する投稿は、予告なく削除する場合があります。",
            "繰り返し違反があった場合は、投稿を制限することがあります。",
          ],
        },
      ]}
    />
  );
}
