import Link from "next/link";
import { Group, Text } from "@mantine/core";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

import classes from "./PaginationNav.module.css";

export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total: items.length,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, items.length),
  };
}

export function pageParams(total: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildRange(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  let previous = 0;
  for (const current of sorted) {
    if (previous && current - previous > 1) {
      result.push("gap");
    }
    result.push(current);
    previous = current;
  }
  return result;
}

export function PaginationNav({
  basePath,
  query,
  page,
  totalPages,
  from,
  to,
  total,
}: {
  basePath: string;
  query?: string;
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
}) {
  const href = (target: number) => {
    if (query) {
      const base = `${basePath}?${query}`;
      return target <= 1 ? base : `${base}&page=${target}`;
    }
    return target <= 1 ? basePath : `${basePath}/page/${target}`;
  };

  return (
    <Group justify="space-between" align="center" mt="md" wrap="wrap" gap="xs">
      <Text size="xs" c="dimmed">
        {total === 0 ? "0件" : `${from}〜${to}件目 / 全${total}件`}
      </Text>

      {totalPages > 1 && (
        <nav aria-label="ページ送り" className={classes.nav}>
          {page > 1 ? (
            <Link href={href(page - 1)} className={classes.arrow} aria-label="前のページ">
              <TbChevronLeft size={14} />
            </Link>
          ) : (
            <span className={classes.arrowDisabled} aria-hidden>
              <TbChevronLeft size={14} />
            </span>
          )}

          {buildRange(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} className={classes.gap}>
                …
              </span>
            ) : (
              <Link
                key={item}
                href={href(item)}
                className={classes.page}
                data-active={item === page || undefined}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </Link>
            ),
          )}

          {page < totalPages ? (
            <Link href={href(page + 1)} className={classes.arrow} aria-label="次のページ">
              <TbChevronRight size={14} />
            </Link>
          ) : (
            <span className={classes.arrowDisabled} aria-hidden>
              <TbChevronRight size={14} />
            </span>
          )}
        </nav>
      )}
    </Group>
  );
}
