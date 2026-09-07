import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { TbBadgeVr, TbBrandX, TbShoppingBag } from "react-icons/tb";

import type { EntrySource } from "../lib/categories";
import { SOURCE_LABELS } from "../lib/entry-source";

const SOURCE_ICONS = {
  x: TbBrandX,
  vrchat: TbBadgeVr,
  booth: TbShoppingBag,
} as const;

const SOURCE_ORDER = ["x", "vrchat", "booth"] as const;

export function EntrySourceLinks({ sources }: { sources: EntrySource[] }) {
  if (sources.length === 0) {
    return null;
  }

  const ordered = [...sources].sort(
    (a, b) => SOURCE_ORDER.indexOf(a.source) - SOURCE_ORDER.indexOf(b.source),
  );

  return (
    <Group gap={4} wrap="nowrap">
      {ordered.map((source) => {
        const Icon = SOURCE_ICONS[source.source];
        const label = `${SOURCE_LABELS[source.source]}で開く`;
        return (
          <Tooltip key={`${source.source}:${source.sourceId}`} label={label}>
            <ActionIcon
              component="a"
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              variant="subtle"
              color="gray"
              size="lg"
              aria-label={label}
            >
              <Icon size={18} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
