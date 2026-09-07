"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ActionIcon,
  Group,
  Loader,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  useComputedColorScheme,
} from "@mantine/core";
import {
  Categories,
  Emoji,
  EmojiStyle,
  Theme,
  type EmojiClickData,
} from "emoji-picker-react";
import { TbMoodPlus } from "react-icons/tb";

import type { Reactions } from "../lib/categories";
import classes from "./ReactionBar.module.css";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <Group justify="center" w={320} h={360}>
      <Loader size="sm" />
    </Group>
  ),
});

const PICKER_CATEGORIES = [
  { category: Categories.SUGGESTED, name: "よく使う" },
  { category: Categories.SMILEYS_PEOPLE, name: "顔と人" },
  { category: Categories.ANIMALS_NATURE, name: "動物と自然" },
  { category: Categories.FOOD_DRINK, name: "食べ物と飲み物" },
  { category: Categories.TRAVEL_PLACES, name: "旅行と場所" },
  { category: Categories.ACTIVITIES, name: "アクティビティ" },
  { category: Categories.OBJECTS, name: "物" },
  { category: Categories.SYMBOLS, name: "記号" },
  { category: Categories.FLAGS, name: "旗" },
];

function TwemojiIcon({
  unified,
  size = 16,
}: {
  unified: string;
  size?: number;
}) {
  return (
    <Emoji
      unified={unified}
      size={size}
      emojiStyle={EmojiStyle.TWITTER}
      lazyLoad
    />
  );
}

export function ReactionBar({
  reactions,
  mine,
  onToggle,
}: {
  reactions: Reactions;
  mine: string[];
  onToggle: (emoji: string) => Promise<void>;
}) {
  const [pickerOpened, setPickerOpened] = useState(false);
  const [busy, setBusy] = useState(false);

  const colorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const toggle = async (emoji: string) => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await onToggle(emoji);
    } catch {
      // 失敗時は次回の再取得で整合するため、ここでは握りつぶす
    } finally {
      setBusy(false);
    }
  };

  const handlePick = async (data: EmojiClickData) => {
    setPickerOpened(false);
    await toggle(data.unified);
  };

  const chips = Object.entries(reactions).filter(([, count]) => count > 0);

  return (
    <Group gap={4} wrap="wrap">
      {chips.map(([unified, count]) => (
        <button
          key={unified}
          type="button"
          className={classes.chip}
          data-active={mine.includes(unified) || undefined}
          onClick={() => toggle(unified)}
        >
          <TwemojiIcon unified={unified} />
          <span className={classes.count}>{count}</span>
        </button>
      ))}

      <Popover
        opened={pickerOpened}
        onChange={setPickerOpened}
        onDismiss={() => setPickerOpened(false)}
        position="bottom-start"
        withinPortal
        zIndex={400}
        trapFocus={false}
        radius="md"
        shadow="md"
        offset={6}
        classNames={{ dropdown: classes.pickerDropdown }}
      >
        <PopoverTarget>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            radius="xl"
            title="リアクションを追加"
            aria-label="リアクションを追加"
            aria-expanded={pickerOpened}
            onClick={() => setPickerOpened((value) => !value)}
          >
            <TbMoodPlus size={16} />
          </ActionIcon>
        </PopoverTarget>

        <PopoverDropdown>
          <EmojiPicker
            onEmojiClick={handlePick}
            emojiStyle={EmojiStyle.TWITTER}
            theme={colorScheme === "dark" ? Theme.DARK : Theme.LIGHT}
            categories={PICKER_CATEGORIES}
            searchPlaceHolder="絵文字を検索"
            autoFocusSearch={false}
            previewConfig={{ showPreview: false }}
            lazyLoadEmojis
            skinTonesDisabled
            width={320}
            height={360}
          />
        </PopoverDropdown>
      </Popover>
    </Group>
  );
}
