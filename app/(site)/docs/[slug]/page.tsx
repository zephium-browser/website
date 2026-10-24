import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/components/docs/content";
import { DocPage } from "@/components/docs/doc-page";
import { docPath, pages, topicBySlug } from "@/lib/docs";
import { site } from "@/lib/site";

/** One page per topic, all built at deploy time. Anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) return {};
  const title = `${topic.title} · Docs`;
  return {
    title,
    description: topic.summary,
    alternates: { canonical: docPath(topic.slug) },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: `${title} · ${site.name}`,
      description: topic.summary,
      url: docPath(topic.slug),
      locale: "en_US",
    },
  };
}

export default async function DocsTopicPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  const doc = content[slug];
  if (!topic || !doc) notFound();
  return <DocPage slug={topic.slug} title={topic.title} doc={doc} />;
}
