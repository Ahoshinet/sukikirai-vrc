"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Group, Loader, Stack, Text } from "@mantine/core";

import type { Entry } from "../lib/categories";
import { PAGE_SIZE, PaginationNav, parsePage } from "./PaginationNav";
import { RankingList } from "./RankingList";

export function SearchResults() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const page = parsePage(params.get("page") ?? undefined);

  const [state, setState] = useState<{
    items: Entry[];
    total: number;
    loading: boolean;
    error: string | null;
  }>({ items: [], total: 0, loading: query !== "", error: null });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (query === "") {
      setState({ items: [], total: 0, loading: false, error: null });
      return;
    }

    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));

    void fetch(
      `/api/search?q=${encodeURIComponent(query)}&page=${page}`,
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        return (await response.json()) as { items: Entry[]; total: number };
      })
      .then((data) => {
        if (active) {
          setState({
            items: data.items,
            total: data.total,
            loading: false,
            error: null,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            items: [],
            total: 0,
            loading: false,
            error: "検索できませんでした。時間をおいて再度お試しください。",
          });
        }
      });

    return () => {
      active = false;
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [query, page]);

  if (query === "") {
    return (
      <Card withBorder radius="md" padding="xl">
        <Text size="sm" c="dimmed" ta="center">
          検索したい名前を入力してください。
        </Text>
      </Card>
    );
  }

  if (state.loading) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Text size="sm" c="dimmed" ta="center">
          {state.error}
        </Text>
      </Card>
    );
  }

  if (state.total === 0) {
    return (
      <Stack gap="xs">
        <Card withBorder radius="md" padding="xl">
          <Text size="sm" c="dimmed" ta="center">
            「{query}」に一致する対象は見つかりませんでした。
          </Text>
        </Card>
        <Text size="xs" c="dimmed" ta="center">
          まだ掲載されていない場合は、新しい投票ページを作成できます。
        </Text>
      </Stack>
    );
  }

  const offset = (page - 1) * PAGE_SIZE;

  return (
    <>
      <RankingList entries={state.items} startRank={offset + 1} />
      <PaginationNav
        basePath="/search"
        query={`q=${encodeURIComponent(query)}`}
        page={page}
        totalPages={Math.max(1, Math.ceil(state.total / PAGE_SIZE))}
        from={offset + 1}
        to={Math.min(offset + PAGE_SIZE, state.total)}
        total={state.total}
      />
    </>
  );
}
