import Link from "next/link";
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { CATEGORIES, type Entry } from "../lib/categories";
import { getEntrySources } from "../lib/queries";
import { AddSourceButton } from "./AddSourceButton";
import { CategoryIcon } from "./CategoryIcon";
import { EntryResults } from "./EntryResults";
import { EntrySourceLinks } from "./EntrySourceLinks";
import { ReportButton } from "./ReportButton";
import classes from "./EntryDetail.module.css";

export async function EntryDetail({ entry }: { entry: Entry }) {
  const category = CATEGORIES[entry.category];
  const sources = await getEntrySources(entry.id);

  return (
    <Stack gap="lg">
      <Breadcrumbs separator="›">
        <Link href="/" className={classes.crumb}>
          ホーム
        </Link>
        <Link href={`/${category.segment}`} className={classes.crumb}>
          {category.label}
        </Link>
        <Text size="xs" c="dimmed">
          {entry.name}
        </Text>
      </Breadcrumbs>

      <Card withBorder radius="md" padding="lg">
        <Group align="center" wrap="nowrap" gap="md">
          <Avatar
            size={72}
            radius="md"
            name={entry.name}
            color="initials"
            src={entry.imageUrl ? `/api/avatar/${entry.id}` : undefined}
          />
          <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            <Badge
              size="sm"
              variant="light"
              color="gray"
              leftSection={<CategoryIcon category={entry.category} size={12} />}
              w="fit-content"
            >
              {category.label}
            </Badge>
            <Title order={1} size="h3">
              {entry.name}
            </Title>
          </Stack>

          <Group gap={2} wrap="nowrap">
            <EntrySourceLinks sources={sources} />
            {sources.length > 0 && (
              <Divider orientation="vertical" h={22} mx={4} />
            )}
            <ReportButton targetType="entry" targetId={entry.id} />
            <AddSourceButton entryId={entry.id} sources={sources} />
          </Group>
        </Group>
      </Card>

      <EntryResults entry={entry} />
    </Stack>
  );
}
