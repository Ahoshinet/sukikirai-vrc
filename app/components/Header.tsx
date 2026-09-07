"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActionIcon,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import {
  TbLogin,
  TbMenu2,
  TbMoon,
  TbSearch,
  TbSun,
  TbPlus,
} from "react-icons/tb";

import { AuthButtons } from "./AuthButtons";
import classes from "./Header.module.css";

export const NAV_LINKS = [
  { label: "ホーム", href: "/" },
  { label: "総合ランキング", href: "/ranking" },
  { label: "ユーザー", href: "/users" },
  { label: "アバター", href: "/avatars" },
  { label: "ワールド", href: "/worlds" },
  { label: "グループ", href: "/groups" },
  { label: "新着コメント", href: "/comments" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { toggleColorScheme } = useMantineColorScheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <Container size="lg" className={classes.topInner}>
          <Group gap="xs" wrap="nowrap">
            <Burger
              opened={drawerOpened}
              onClick={() => setDrawerOpened((value) => !value)}
              size="sm"
              hiddenFrom="sm"
              aria-label="メニューを開く"
              aria-expanded={drawerOpened}
            />
            <Link href="/" className={classes.logo}>
              好き嫌い<span className={classes.logoAccent}>VRC</span>
              <span className={classes.logoTld}>.com</span>
            </Link>
          </Group>

          <form action="/search" className={classes.searchForm}>
            <TextInput
              name="q"
              className={classes.search}
              placeholder="ユーザー・アバター・ワールドを検索"
              size="sm"
              leftSection={<TbSearch size={16} />}
              aria-label="サイト内検索"
            />
          </form>

          <Group gap="xs" wrap="nowrap" className={classes.actions}>
            <AuthButtons />

            <Button
              component="a"
              href="/register"
              size="xs"
              leftSection={<TbPlus size={15} />}
            >
              登録
            </Button>

            <ActionIcon
              onClick={toggleColorScheme}
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="配色を切り替える"
            >
              <span className={classes.iconLightOnly}>
                <TbMoon size={18} />
              </span>
              <span className={classes.iconDarkOnly}>
                <TbSun size={18} />
              </span>
            </ActionIcon>
          </Group>
        </Container>
      </div>

      <nav className={classes.nav}>
        <Container size="lg" className={classes.navInner}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classes.navLink}
              data-active={isActive(link.href) || undefined}
            >
              {link.label}
            </Link>
          ))}
        </Container>
      </nav>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="xs"
        padding="md"
        title={
          <Group gap={6}>
            <TbMenu2 size={18} />
            <Text fw={700} size="lg">
              メニュー
            </Text>
          </Group>
        }
      >
        <Stack gap="xs">
          <form action="/search">
            <TextInput
              name="q"
              placeholder="検索"
              size="sm"
              aria-label="サイト内検索"
              leftSection={<TbSearch size={16} />}
            />
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classes.drawerLink}
              data-active={isActive(link.href) || undefined}
              onClick={() => setDrawerOpened(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            component="a"
            href="/login"
            variant="light"
            leftSection={<TbLogin size={15} />}
            mt="xs"
          >
            ログイン
          </Button>
          <Button
            component="a"
            href="/register"
            leftSection={<TbPlus size={15} />}
          >
            新しい投票ページ
          </Button>
        </Stack>
      </Drawer>
    </header>
  );
}
