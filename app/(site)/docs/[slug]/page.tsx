import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/components/docs/content";
import { DocPage } from "@/components/docs/doc-page";
import { docPath, pages, topicBySlug } from "@/lib/docs";
import { DocsBreadcrumbs } from "@/components/structured-data";
import { pageMetadata } from "@/lib/metadata";

/** One page per topic, all built at deploy time. Anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) return {};
  return pageMetadata({
    title: `${topic.title} · Docs`,
    description: topic.summary,
    path: docPath(topic.slug),
    type: "article",
  });
}

export default async function DocsTopicPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  const doc = content[slug];
  if (!topic || !doc) notFound();
  return (
    <>
      <DocsBreadcrumbs title={topic.title} path={docPath(topic.slug)} />
      <DocPage slug={topic.slug} title={topic.title} doc={doc} />
    </>
  );
}
