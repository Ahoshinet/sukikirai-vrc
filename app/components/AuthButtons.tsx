"use client";

import { useRouter } from "next/navigation";
import { ActionIcon, Button, Menu, Skeleton } from "@mantine/core";
import { TbLogin, TbLogout, TbShieldCheck, TbUser } from "react-icons/tb";

import { authClient, useSession } from "../lib/auth-client";
import classes from "./Header.module.css";

export function AuthButtons() {
  const router = useRouter();
  const { data, isPending } = useSession();

  if (isPending) {
    return <Skeleton height={26} width={92} radius="sm" />;
  }

  if (!data?.user) {
    return (
      <Button
        component="a"
        href="/login"
        size="xs"
        variant="subtle"
        color="gray"
        leftSection={<TbLogin size={15} />}
        visibleFrom="xs"
      >
        ログイン
      </Button>
    );
  }

  return (
    <Menu position="bottom-end" withinPortal shadow="md">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          aria-label="アカウントメニュー"
        >
          <TbUser size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label className={classes.menuLabel}>{data.user.name}</Menu.Label>
        <Menu.Item
          component="a"
          href="/admin"
          leftSection={<TbShieldCheck size={15} />}
        >
          通報管理
        </Menu.Item>
        <Menu.Item
          leftSection={<TbLogout size={15} />}
          onClick={() => {
            void authClient.signOut().then(() => {
              router.push("/");
              router.refresh();
            });
          }}
        >
          ログアウト
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
