"use client";

import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Group, Stack, Text, Textarea } from "@mantine/core";
import {
  TbCornerDownRight,
  TbMessageReply,
  TbThumbDown,
  TbThumbUp,
} from "react-icons/tb";

import { formatDateTime, type Comment, type Stance } from "../lib/categories";
import { ReactionBar } from "./ReactionBar";
import { ReportButton } from "./ReportButton";
import classes from "./CommentThread.module.css";

export interface CommentNode {
  comment: Comment;
  replies: Comment[];
}

function StanceBadge({ stance }: { stance: Stance }) {
  const isSuki = stance === "suki";
  return (
    <Badge
      size="xs"
      variant="light"
      color={isSuki ? "brand" : "kirai"}
      leftSection={isSuki ? <TbThumbUp size={11} /> : <TbThumbDown size={11} />}
    >
      {isSuki ? "好き" : "嫌い"}
    </Badge>
  );
}

function ReplyForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (body: string) => Promise<void>;
  onClose: () => void;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit(body.trim());
      setBody("");
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "投稿できませんでした。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.replyForm}>
      <Stack gap="xs">
        <Textarea
          placeholder="返信を入力..."
          minRows={2}
          autosize
          value={body}
          error={error}
          onChange={(event) => setBody(event.currentTarget.value)}
          aria-label="返信"
        />
        <Group gap="xs" justify="flex-end">
          <Button size="xs" variant="subtle" color="gray" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            size="xs"
            type="submit"
            loading={busy}
            disabled={body.trim() === ""}
          >
            返信する
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function CommentBody({
  comment,
  isReply,
  onReply,
  onReact,
}: {
  comment: Comment;
  isReply: boolean;
  onReply: ((body: string) => Promise<void>) | null;
  onReact: (commentId: string, emoji: string) => Promise<void>;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className={isReply ? classes.reply : classes.comment}>
      <Group gap="xs" mb={4} wrap="nowrap">
        {isReply && (
          <TbCornerDownRight size={13} className={classes.replyIcon} />
        )}
        <StanceBadge stance={comment.stance} />
        <Text size="xs" className={classes.authorId} title="投稿者の匿名ID">
          ID:{comment.authorLabel}
        </Text>
        <Text size="xs" c="dimmed" ml="auto">
          {formatDateTime(comment.postedAt)}
        </Text>
      </Group>

      <Text size="sm">{comment.body}</Text>

      <Group gap="sm" mt={6}>
        <ReactionBar
          reactions={comment.reactions}
          mine={comment.mine}
          onToggle={(emoji) => onReact(comment.id, emoji)}
        />
        {onReply && (
          <button
            type="button"
            className={classes.replyButton}
            onClick={() => setReplying((value) => !value)}
          >
            <TbMessageReply size={13} />
            返信
          </button>
        )}
        <ReportButton targetType="comment" targetId={comment.id} compact />
      </Group>

      {replying && onReply && (
        <ReplyForm onSubmit={onReply} onClose={() => setReplying(false)} />
      )}
    </div>
  );
}

export function CommentThreadList({
  threads,
  onReply,
  onReact,
}: {
  threads: CommentNode[];
  onReply: (body: string, parentId: string | null) => Promise<void>;
  onReact: (commentId: string, emoji: string) => Promise<void>;
}) {
  if (threads.length === 0) {
    return (
      <Card withBorder radius="md" padding="xl">
        <Text size="sm" c="dimmed" ta="center">
          まだコメントがありません。
        </Text>
      </Card>
    );
  }

  return (
    <Card padding={0} withBorder radius="md">
      {threads.map(({ comment, replies }) => (
        <article key={comment.id} className={classes.thread}>
          <CommentBody
            comment={comment}
            isReply={false}
            onReply={(body) => onReply(body, comment.id)}
            onReact={onReact}
          />
          {replies.map((reply) => (
            <CommentBody
              key={reply.id}
              comment={reply}
              isReply
              onReply={null}
              onReact={onReact}
            />
          ))}
        </article>
      ))}
    </Card>
  );
}
