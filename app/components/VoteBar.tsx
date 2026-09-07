import { ProgressLabel, ProgressRoot, ProgressSection } from "@mantine/core";

import { sukiPercent } from "../lib/categories";

export function VoteBar({
  entry,
  size = "lg",
}: {
  entry: { suki: number; kirai: number };
  size?: string;
}) {
  const suki = sukiPercent(entry);

  return (
    <ProgressRoot size={size} radius="sm">
      <ProgressSection value={suki} color="brand">
        <ProgressLabel>好き {suki}%</ProgressLabel>
      </ProgressSection>
      <ProgressSection value={100 - suki} color="kirai">
        <ProgressLabel>嫌い {100 - suki}%</ProgressLabel>
      </ProgressSection>
    </ProgressRoot>
  );
}
