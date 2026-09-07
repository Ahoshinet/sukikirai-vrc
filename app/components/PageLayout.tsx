import type { ReactNode } from "react";
import { Container, Grid, GridCol, Group, Stack, Text, Title } from "@mantine/core";

import { SiteSidebar } from "./SiteSidebar";

export async function PageLayout({
  children,
  withSidebar = true,
}: {
  children: ReactNode;
  withSidebar?: boolean;
}) {
  if (!withSidebar) {
    return (
      <Container size="md" py="md">
        {children}
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Grid gap="lg">
        <GridCol span={{ base: 12, md: 8 }}>{children}</GridCol>
        <GridCol span={{ base: 12, md: 4 }}>
          <SiteSidebar />
        </GridCol>
      </Grid>
    </Container>
  );
}

export function PageHeading({
  icon,
  title,
  description,
  meta,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;
}) {
  return (
    <Stack gap={4} mb="sm">
      <Group justify="space-between" align="flex-end" wrap="nowrap">
        <Group gap={8} wrap="nowrap">
          {icon}
          <Title order={1} size="h2">
            {title}
          </Title>
        </Group>
        {meta}
      </Group>
      {description && (
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      )}
    </Stack>
  );
}
