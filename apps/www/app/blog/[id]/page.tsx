import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";

import type { SC } from "~/server";

import { S3 } from "@aws-sdk/client-s3";
import { clsx } from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const s3 = new S3({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

interface PageProps {
  params: PageParams;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const object = await s3.getObject({
    Bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    Key: `blog/${params.id}`,
  });
  return {
    title: object.Metadata?.title,
    description: object.Metadata?.description,
    openGraph: {
      type: "article",
      title: object.Metadata?.title,
      description: object.Metadata?.description,
      publishedTime: object.Metadata?.date,
      tags: object.Metadata?.tags?.split(","),
      authors: ["https://twitter.com/phuctm97"],
    },
  };
}

async function generateContent(params: PageParams): Promise<string> {
  const object = await s3.getObject({
    Bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    Key: `blog/${params.id}`,
  });
  if (!object.Body) notFound();
  return object.Body.transformToString();
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
          "truncate text-gray-600 hover:text-gray-900 hover:underline",
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
      <header className="mx-auto mb-5 mt-10 w-full max-w-2xl overflow-hidden px-5 md:mt-12 lg:mt-14">
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
            {content}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
};

export default Page;
