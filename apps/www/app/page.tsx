import type { ComponentPropsWithoutRef } from "react";

import type { SC } from "~/server";

import { clsx } from "clsx";
import { select as hastSelect } from "hast-util-select";
import { toText as hastToText } from "hast-util-to-text";
import Link from "next/link";
import { forwardRef } from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { s3 } from "~/server";

interface Post {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  date?: Date;
}

const postProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeRaw);

async function generateOldPost(id: string): Promise<Post> {
  const object = await s3.getObject({
    Bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    Key: `blog/${id}`,
  });
  let title = object.Metadata?.title;
  let description = object.Metadata?.description;
  if (!title || !description) {
    if (!object.Body) throw new Error("Could generate old post.");
    const postContent = await object.Body.transformToString();
    const postTree = await postProcessor.run(postProcessor.parse(postContent));
    if (!title) {
      const h1 = hastSelect("h1", postTree);
      if (h1) title = hastToText(h1);
    }
    if (!description) {
      const p = hastSelect("p", postTree);
      if (p) description = hastToText(p);
    }
  }
  if (!title) title = "Untitled";
  return {
    id,
    title,
    description,
    tags: object.Metadata?.tags ? object.Metadata.tags.split(",") : [],
    date: object.Metadata?.date ? new Date(object.Metadata.date) : undefined,
  };
}

async function generateOldPosts(): Promise<Post[]> {
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
  const oldPosts = await Promise.all(Array.from(ids).map(generateOldPost));
  oldPosts.sort((a, b) =>
    a.date && b.date ? b.date.getTime() - a.date.getTime() : 0
  );
  return oldPosts;
}

interface Product {
  name: string;
  url?: string;
  description: string;
}

const products: Product[] = [
  {
    name: "Bard Wow!",
    url: "https://chrome.google.com/webstore/detail/bard-wow/amcbnnofeeceacckbhpplhhemgbmieon",
    description: "Save & Access Bard Chat History",
  },
  {
    name: "ChatFRIDAY",
    url: "https://www.chatfriday.com",
    description: "Enhanced UI/UX for ChatGPT",
  },
  {
    name: "NextStatic",
    url: "https://www.next-static.com",
    description: "10x Cheaper Image Optimization for Next.js",
  },
  {
    name: "Queue",
    url: "https://www.queue.so",
    description: "Twitter Scheduling Tool for Notion",
  },
  {
    name: "Nora",
    url: "https://www.getnora.page",
    description: "Project Management Template for Notion",
  },
  {
    name: "Clean Mac Desktop",
    url: "https://phuctm97.gumroad.com/l/clean-mac-desktop",
    description: "Clean & Backup MacOS Desktop in 1-click",
  },
  {
    name: "nbundle",
    description: "App Store & Developer Platform for Notion",
  },
  {
    name: "Daily",
    url: "https://www.usedaily.co",
    description: "Simple Scratchpad for Pretty Much Anything",
  },
  {
    name: "shell.how",
    url: "https://www.shell.how",
    description: "Explain Shell Commands",
  },
];

interface ContentLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "target" | "rel"> {
  neutral?: boolean;
}

function isExternalContentLink(href: ContentLinkProps["href"]): boolean {
  if (typeof href !== "string") return false;
  try {
    new URL(href);
    return true;
  } catch {
    return false;
  }
}

const ContentLink = forwardRef<HTMLAnchorElement, ContentLinkProps>(
  ({ href, neutral, className, ...props }, ref) => {
    const isExternal = isExternalContentLink(href);
    return (
      <Link
        ref={ref}
        className={clsx(
          neutral
            ? "underline-offset-2 hover:underline"
            : "text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline",
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

if (process.env.NODE_ENV === "development")
  ContentLink.displayName = "ContentLink";

type MaybeLinkProps = Partial<ContentLinkProps>;

const MaybeLink = forwardRef<HTMLAnchorElement, MaybeLinkProps>(
  ({ href, ...props }, ref) => {
    if (href) return <ContentLink ref={ref} href={href} {...props} />;
    return <span ref={ref} {...props} />;
  }
);

if (process.env.NODE_ENV === "development") MaybeLink.displayName = "MaybeLink";

const Page: SC = async () => {
  const oldPosts = await generateOldPosts();
  return (
    <main className="mx-auto w-full max-w-2xl overflow-hidden px-5 py-10 md:py-12 lg:py-14">
      <p className="mb-5">Hi, I&apos;m Phuc!</p>
      <p className="mb-10">
        I&apos;m a full-time indie hacker. I build Internet products to solve
        problems for myself and others. I then charge a small fee to keep the
        lights on and live independently.
      </p>
      <h2 className="mb-5 font-semibold">Products</h2>
      <ul className="mb-10 space-y-5">
        {products.map((product) => (
          <li key={product.name}>
            <MaybeLink href={product.url} neutral>
              {product.name}
            </MaybeLink>
            <span className="text-gray-600"> - {product.description}</span>
          </li>
        ))}
      </ul>
      <h2 className="mb-5 font-semibold">Tweets</h2>
      <p className="mb-5">
        I build in public on Twitter. I tweet product updates and learnings{" "}
        <span className="italic">almost</span> every day, life updates
        sometimes, and epic shit-posts most often.
      </p>
      <p className="mb-10">
        See my tweets{" "}
        <ContentLink href="https://twitter.com/phuctm97">@phuctm97</ContentLink>
        .
      </p>
      <h2 className="mb-5 font-semibold">Sources</h2>
      <p className="mb-5">
        I open-source most of my recent work. It&apos;s building in public at
        its finest. Besides, it helps me get over the idea that my code is
        shitty, which it always is, to just ship it.
      </p>
      <p className="mb-10">
        See my sources{" "}
        <ContentLink href="https://github.com/phuctm97">@phuctm97</ContentLink>.
      </p>
      <h2 className="mb-5 font-semibold">Posts</h2>
      <p className="mb-5 text-gray-600">(No recent posts)</p>
      <details className="mb-10">
        <summary className="select-none">Old posts</summary>
        <p className="my-5 text-gray-600">
          I wrote these posts a long time ago, some of them may be outdated.
        </p>
        <ul className="space-y-5">
          {oldPosts.map((oldPost) => (
            <li
              key={oldPost.id}
              className="flex flex-row items-start justify-between space-x-5"
            >
              <ContentLink
                className="flex-1 select-none"
                href={`blog/${oldPost.id}`}
                neutral
              >
                {oldPost.title}
              </ContentLink>
              {oldPost.date && (
                <time
                  className="shrink-0 text-gray-400"
                  dateTime={oldPost.date.toISOString()}
                >
                  {oldPost.date.toLocaleDateString("en", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
            </li>
          ))}
        </ul>
      </details>
      <h2 className="mb-5 font-semibold">Updates</h2>
      <p className="mb-5">
        I send indie-hacking updates <span className="italic">at most</span>{" "}
        once a month. I write about challenges I&apos;ve faced, products and/or
        features I&apos;ve shipped, and relevant learnings & thoughts.
      </p>
      <iframe className="w-full" src="https://phuctm97.substack.com/embed" />
    </main>
  );
};

export default Page;
