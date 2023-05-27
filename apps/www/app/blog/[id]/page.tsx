import type { Root } from "mdast";
import type { ComponentPropsWithoutRef } from "react";

import type { SC } from "~/server";

import { clsx } from "clsx";
import fs from "fs";
import Link from "next/link";
import path from "path";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

const fileProcessor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ["yaml"]);

const contentProcessor = unified().use(remarkStringify);

const contentDir = path.resolve(process.cwd(), "app", "blog", "[id]", "_");

interface PageParams {
  id: string;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const files = await fs.promises.readdir(contentDir);
  return files
    .map((file) => path.basename(file))
    .map<PageParams>((id) => ({ id }));
}

interface PageProps {
  params: PageParams;
}

async function getPageContent(params: PageParams): Promise<string> {
  const file = await fs.promises.readFile(
    path.resolve(contentDir, `${params.id}.md`)
  );
  const fileTree = await fileProcessor.run(
    fileProcessor.parse(file.toString())
  );
  const contentChildren = fileTree.children.filter((n) => n.type !== "yaml");
  const contentTree: Root = { type: "root", children: contentChildren };
  return contentProcessor.stringify(contentTree);
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
  const content = await getPageContent(params);
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
