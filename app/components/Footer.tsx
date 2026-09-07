import Link from "next/link";
import { Container, Divider, Group, Stack, Text } from "@mantine/core";

import classes from "./Footer.module.css";

const FOOTER_GROUPS = [
  {
    title: "サイト",
    links: [
      { label: "このサイトについて", href: "/about" },
      { label: "ランキングの仕組み", href: "/about/ranking" },
      { label: "新しい投票ページ", href: "/register" },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
  {
    title: "規約",
    links: [
      { label: "利用規約", href: "/terms" },
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "ガイドライン", href: "/guidelines" },
    ],
  },
  {
    title: "カテゴリ",
    links: [
      { label: "総合ランキング", href: "/ranking" },
      { label: "ユーザー", href: "/users" },
      { label: "アバター", href: "/avatars" },
      { label: "ワールド", href: "/worlds" },
      { label: "グループ", href: "/groups" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className={classes.root}>
      <Container size="lg">
        <div className={classes.columns}>
          <Stack gap="xs" className={classes.brandColumn}>
            <Text fw={800} size="lg">
              好き嫌いVRC<span className={classes.tld}>.com</span>
            </Text>
            <Text size="sm" c="dimmed">
              VRChatで気になる物を見つけて、匿名で投票できるコミュニティサイトです。
            </Text>
          </Stack>

          {FOOTER_GROUPS.map((group) => (
            <Stack key={group.title} gap={6}>
              <Text fw={700} size="sm">
                {group.title}
              </Text>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className={classes.link}>
                  {link.label}
                </Link>
              ))}
            </Stack>
          ))}
        </div>

        <Divider my="lg" />

        <Group justify="space-between" gap="xs">
          <Text size="xs" c="dimmed">
            掲載内容は利用者の投票・投稿によるものであり、運営者の見解ではありません。
          </Text>
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} 好き嫌いVRC.com
          </Text>
        </Group>
      </Container>
    </footer>
  );
}
