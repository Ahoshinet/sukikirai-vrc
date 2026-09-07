import {
  EntryPageView,
  entryMetadata,
} from "../../components/CategoryPageView";

export const revalidate = 60;

const CATEGORY = "user" as const;

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return entryMetadata(CATEGORY, slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EntryPageView category={CATEGORY} slug={slug} />;
}
