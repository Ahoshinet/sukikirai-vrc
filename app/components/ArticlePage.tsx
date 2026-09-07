import type { ReactNode } from "react";
import { Card, List, ListItem, Stack, Text, Title } from "@mantine/core";

import { PageHeading, PageLayout } from "./PageLayout";

export interface ArticleSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export function ArticlePage({
  icon,
  title,
  lead,
  sections,
}: {
  icon?: ReactNode;
  title: string;
  lead?: string;
  sections: ArticleSection[];
}) {
  return (
    <PageLayout withSidebar={false}>
      <PageHeading icon={icon} title={title} description={lead} />

      <Card withBorder radius="md" padding="lg">
        <Stack gap="lg">
          {sections.map((section) => (
            <Stack key={section.heading} gap="xs">
              <Title order={2} size="h5">
                {section.heading}
              </Title>
              {section.paragraphs?.map((paragraph) => (
                <Text key={paragraph} size="sm">
                  {paragraph}
                </Text>
              ))}
              {section.list && (
                <List size="sm" spacing={4}>
                  {section.list.map((item) => (
                    <ListItem key={item}>{item}</ListItem>
                  ))}
                </List>
              )}
            </Stack>
          ))}
        </Stack>
      </Card>
    </PageLayout>
  );
}
