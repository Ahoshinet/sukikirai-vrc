"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { TbLock, TbMessageCircle, TbThumbDown, TbThumbUp } from "react-icons/tb";

import {
  formatCount,
  sukiPercent,
  type Comment,
  type Entry,
  type Stance,
  type VoteTrendPoint,
} from "../lib/categories";
import { CommentComposer } from "./CommentComposer";
import { CommentThreadList, type CommentNode } from "./CommentThread";
import { VoteBar } from "./VoteBar";
import { VoteTrend } from "./VoteTrend";
import classes from "./EntryResults.module.css";

function buildThreads(comments: Comment[]): CommentNode[] {
  return comments
    .filter((comment) => comment.parentId === null)
    .map((comment) => ({
      comment,
      replies: comments
        .filter((reply) => reply.parentId === comment.id)
        .sort((a, b) => a.postedAt.localeCompare(b.postedAt)),
    }));
}

export function EntryResults({ entry }: { entry: Entry }) {
  const [counts, setCounts] = useState({
    suki: entry.suki,
    kirai: entry.kirai,
    comments: entry.comments,
  });
  const [vote, setVote] = useState<Stance | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [trend, setTrend] = useState<VoteTrendPoint[]>([]);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    const response = await fetch(`/api/entries/${entry.id}/comments`);
    if (response.ok) {
      const data = (await response.json()) as {
        vote: Stance;
        comments: Comment[];
        trend: VoteTrendPoint[];
      };
      setVote(data.vote);
      setComments(data.comments);
      setTrend(data.trend);
      setNeedsLogin(false);
      return;
    }
    setComments([]);
    setTrend([]);
    setVote(null);
    setNeedsLogin(response.status === 401);
  }, [entry.id]);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadComments().finally(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [loadComments]);

  const submitVote = async (stance: Stance | "clear") => {
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/entries/${entry.id}/vote`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stance }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? "投票できませんでした。");
      setNeedsLogin(response.status === 401);
      setBusy(false);
      return;
    }

    const data = (await response.json()) as {
      vote: Stance | null;
      suki: number;
      kirai: number;
      comments: number;
    };
    setCounts({ suki: data.suki, kirai: data.kirai, comments: data.comments });
    setVote(data.vote);
    if (data.vote) {
      await loadComments();
    } else {
      setComments([]);
    }
    setBusy(false);
  };

  const postComment = async (body: string, parentId: string | null) => {
    const response = await fetch(`/api/entries/${entry.id}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body, parentId }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(data.error ?? "投稿できませんでした。");
    }
    const data = (await response.json()) as { comments: Comment[] };
    setComments(data.comments);
    setCounts((current) => ({ ...current, comments: current.comments + 1 }));
  };

  const toggleReaction = async (commentId: string, emoji: string) => {
    const response = await fetch(`/api/comments/${commentId}/reactions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(data.error ?? "リアクションできませんでした。");
    }
    await loadComments();
  };

  const suki = sukiPercent(counts);

  if (loading) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      </Card>
    );
  }

  if (vote === null) {
    return (
      <Stack gap="lg">
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md" align="center">
            <TbLock size={28} color="var(--mantine-color-brand-6)" />
            <Stack gap={4} align="center">
              <Title order={2} size="h5">
                投票すると結果が見られます
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                この対象の好き嫌いの割合と、みんなのコメントは投票後に表示されます。
              </Text>
            </Stack>

            <Group grow gap="sm" w="100%" maw={420}>
              <Button
                size="md"
                color="brand"
                variant="light"
                loading={busy}
                leftSection={<TbThumbUp size={18} />}
                onClick={() => submitVote("suki")}
              >
                好き
              </Button>
              <Button
                size="md"
                color="kirai"
                variant="light"
                loading={busy}
                leftSection={<TbThumbDown size={18} />}
                onClick={() => submitVote("kirai")}
              >
                嫌い
              </Button>
            </Group>

            {error && (
              <Alert color="brand" variant="light" icon={<TbLock size={18} />}>
                <Stack gap="xs">
                  <Text size="sm">{error}</Text>
                  {needsLogin && (
                    <Button
                      component="a"
                      href="/login"
                      size="xs"
                      variant="light"
                      w="fit-content"
                    >
                      ログインする
                    </Button>
                  )}
                </Stack>
              </Alert>
            )}

            <Text size="xs" c="dimmed" ta="center">
              <TbLock size={13} className={classes.inlineIcon} />
              投票にはログインが必要です。集計結果は匿名で表示されます。
            </Text>
          </Stack>
        </Card>

        <Card withBorder radius="md" padding="xl">
          <Stack gap={4} align="center">
            <TbMessageCircle size={22} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              コメント{formatCount(counts.comments)}件は投票後に表示されます。
            </Text>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Card withBorder radius="md" padding="lg">
        <Stack gap="xs">
          <VoteBar entry={counts} />
          <Group gap="lg">
            <Group gap={4}>
              <TbThumbUp size={15} color="var(--mantine-color-brand-6)" />
              <Text size="sm" fw={700} c="brand">
                {formatCount(counts.suki)}
              </Text>
              <Text size="xs" c="dimmed">
                ({suki}%)
              </Text>
            </Group>
            <Group gap={4}>
              <TbThumbDown size={15} color="var(--mantine-color-kirai-6)" />
              <Text size="sm" fw={700} c="kirai">
                {formatCount(counts.kirai)}
              </Text>
              <Text size="xs" c="dimmed">
                ({100 - suki}%)
              </Text>
            </Group>
            <Group gap={4} c="dimmed">
              <TbMessageCircle size={15} />
              <Text size="sm">{formatCount(counts.comments)}</Text>
            </Group>
            <Text size="xs" c="dimmed" ml="auto">
              総投票数 {formatCount(counts.suki + counts.kirai)}
            </Text>
          </Group>

          <Divider my="xs" />

          <VoteTrend points={trend} />
        </Stack>

        <Group justify="space-between" align="center" mt="md" wrap="nowrap">
          <Text size="xs" c="dimmed">
            あなたの投票:{" "}
            <Text span fw={700} c={vote === "suki" ? "brand" : "kirai"}>
              {vote === "suki" ? "好き" : "嫌い"}
            </Text>
          </Text>
          <Button
            size="xs"
            variant="subtle"
            color="gray"
            loading={busy}
            onClick={() => submitVote("clear")}
          >
            投票を取り消す
          </Button>
        </Group>
      </Card>

      <Stack gap="sm">
        <Group gap={6}>
          <TbMessageCircle size={18} />
          <Title order={2} size="h4">
            コメント
          </Title>
          <Text size="sm" c="dimmed">
            {formatCount(counts.comments)}件
          </Text>
        </Group>
        <CommentComposer
          stance={vote}
          onSubmit={(body) => postComment(body, null)}
        />
        <CommentThreadList
          threads={buildThreads(comments)}
          onReply={postComment}
          onReact={toggleReaction}
        />
      </Stack>
    </Stack>
  );
}
