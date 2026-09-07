import type { MetadataRoute } from "next";

import { CATEGORIES, CATEGORY_KEYS } from "./lib/categories";
import { sitemapEntries } from "./lib/queries";
import { SITE_URL } from "./lib/site";

export const revalidate = 300;

const STATIC_PATHS = [
  { path: "/", priority: 1, changeFrequency: "hourly" as const },
  { path: "/ranking", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "/comments", priority: 0.7, changeFrequency: "hourly" as const },
  { path: "/register", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/about/ranking", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/guidelines", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries = await sitemapEntries();

  return [
    ...STATIC_PATHS.map((item) => ({
      url: `${SITE_URL}${item.path}`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    })),
    ...CATEGORY_KEYS.map((key) => ({
      url: `${SITE_URL}/${CATEGORIES[key].segment}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...entries.map((entry) => ({
      url: `${SITE_URL}/${CATEGORIES[entry.category].segment}/${entry.slug}`,
      lastModified: entry.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
