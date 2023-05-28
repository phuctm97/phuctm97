import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";

import type { SC } from "~/server";

import { clsx } from "clsx";
import { select as hastSelect } from "hast-util-select";
import { toText as hastToText } from "hast-util-to-text";
import Link from "next/link";
import { notFound } from "next/navigation";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { s3 } from "~/server";

interface PageParams {
  id: string;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const ids = new Set<string>();
  const listObjectsV2Prefix = "blog/";
  const listObjectsV2 = await s3.listObjectsV2({
    Bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    Prefix: listObjectsV2Prefix,
  });
  if (listObjectsV2.Contents)
    for (const content of listObjectsV2.Contents) {
      if (!content.Key) continue;
      const id = content.Key.substring(listObjectsV2Prefix.length);
      ids.add(id);
    }
  return Array.from(ids).map<PageParams>((id) => ({ id }));
}

interface PageContent {
  body: string;
  tags: string[];
  date?: Date;
}

async function generateContent(params: PageParams): Promise<PageContent> {
  const object = await s3.getObject({
    Bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    Key: `blog/${params.id}`,
  });
  if (!object.Body) notFound();
  const content: PageContent = {
    body: await object.Body.transformToString(),
    tags: object.Metadata?.tags ? object.Metadata.tags.split(",") : [],
    date: object.Metadata?.date ? new Date(object.Metadata.date) : undefined,
  };
  return content;
}

interface PageProps {
  params: PageParams;
}

const contentProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeRaw);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const object = await s3.getObject({
    Bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    Key: `blog/${params.id}`,
  });
  let title = object.Metadata?.title;
  let description = object.Metadata?.description;
  if (!title || !description) {
    if (!object.Body) notFound();
    const content = await object.Body.transformToString();
    const tree = await contentProcessor.run(contentProcessor.parse(content));
    if (!title) {
      const h1 = hastSelect("h1", tree);
      if (h1) title = hastToText(h1);
    }
    if (!description) {
      const p = hastSelect("p", tree);
      if (p) description = hastToText(p);
    }
  }
  return {
    title,
    description,
    openGraph: {
      url: `blog/${params.id}`,
      title,
      description,
      siteName: "Minh-Phuc Tran",
      locale: "en_US",
      type: "article",
      publishedTime: object.Metadata?.date,
      tags: object.Metadata?.tags?.split(","),
      authors: [new URL("https://www.phuctm97.com")],
    },
    alternates: {
      canonical: `blog/${params.id}`,
    },
  };
}

const reactMarkdownRemarkPlugins = [remarkGfm];
const reactMarkdownRehypePlugins = [rehypeRaw];

type NavLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "target" | "rel"
>;

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, href, ...props }, ref) => {
    const isExternal = typeof href === "string" && !href.startsWith("/");
    return (
      <Link
        ref={ref}
        className={clsx(
          "truncate text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline",
          className
        )}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  }
);

if (process.env.NODE_ENV === "development") NavLink.displayName = "NavLink";

const Page: SC<PageProps> = async ({ params }) => {
  const content = await generateContent(params);
  return (
    <>
      <header className="mx-auto mb-5 w-full max-w-2xl overflow-hidden px-5 pt-10 md:pt-12 lg:pt-14">
        <nav className="flex w-full flex-row items-center justify-start space-x-5 overflow-hidden">
          <NavLink href="/">Home</NavLink>
          <NavLink href="https://twitter.com/phuctm97">Twitter</NavLink>
          <NavLink href="https://github.com/phuctm97">Github</NavLink>
        </nav>
      </header>
      <main className="mx-auto mb-10 w-full max-w-2xl overflow-hidden px-5 md:mb-12 lg:mb-14">
        <article className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={reactMarkdownRemarkPlugins}
            rehypePlugins={reactMarkdownRehypePlugins}
          >
            {content.body}
          </ReactMarkdown>
          <hr />
          <footer>
            {content.tags.length > 0 && (
              <>
                <p className="m-0 inline p-0">Tags: </p>
                <ul className="m-0 inline space-x-1 p-0">
                  {content.tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline p-0 after:contents after:content-[','] last-of-type:after:content-none"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {content.date && (
              <p>
                Date:{" "}
                <time dateTime={content.date.toISOString()}>
                  {content.date.toLocaleDateString("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </p>
            )}
          </footer>
        </article>
      </main>
    </>
  );
};

export default Page;
