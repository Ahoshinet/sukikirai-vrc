import type { Metadata } from "next";
import { TbFileText } from "react-icons/tb";

import { ArticlePage } from "../components/ArticlePage";

export const metadata: Metadata = {
  title: "利用規約",
  description: "本サイトの利用条件を定めた規約です。",
};

export default function Page() {
  return (
    <ArticlePage
      icon={<TbFileText size={24} color="var(--mantine-color-brand-6)" />}
      title="利用規約"
      lead="本サイトを利用する前にお読みください。"
      sections={[
        {
          heading: "第1条（適用）",
          paragraphs: [
            "本規約は、本サイトの提供する全てのサービスの利用条件を定めるものです。利用者は本規約に同意した上で本サイトを利用するものとします。",
          ],
        },
        {
          heading: "第2条（投稿内容）",
          paragraphs: [
            "投稿された内容の責任は投稿者に帰属します。運営者は投稿内容の正確性について保証しません。",
            "運営者は、ガイドラインに反すると判断した投稿を予告なく削除できるものとします。",
          ],
        },
        {
          heading: "第3条（禁止事項）",
          list: [
            "法令または公序良俗に違反する行為",
            "他の利用者または第三者の権利を侵害する行為",
            "本サイトの運営を妨害する行為",
          ],
        },
        {
          heading: "第4条（掲載内容）",
          paragraphs: [
            "ランキングおよびコメントとして掲載される内容は、利用者による投票および投稿です。運営者はその内容の真実性を保証せず、運営者の見解を示すものでもありません。",
          ],
        },
        {
          heading: "第5条（掲載の停止および削除）",
          paragraphs: [
            "ご本人またはその他の権利者から削除の申請があった場合、運営者は申請内容と掲載内容を確認し、権利侵害のおそれや本規約への違反などに応じて、掲載の停止または削除その他の必要な対応を行います。",
            "申請はお問い合わせページより受け付けています。",
          ],
        },
        {
          heading: "第6条（免責）",
          paragraphs: [
            "本サイトの利用によって利用者間または利用者と第三者との間に生じた紛争について、運営者は責任を負いません。",
          ],
        },
      ]}
    />
  );
}
