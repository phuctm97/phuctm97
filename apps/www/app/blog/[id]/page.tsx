import type { Root } from "mdast";

import type { SC } from "~/server";

import fs from "fs";
import Link from "next/link";
import path from "path";
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

const Page: SC<PageProps> = async ({ params }) => {
  const content = await getPageContent(params);
  return (
    <>
      <header className="mx-auto mb-5 mt-10 w-full max-w-2xl overflow-hidden px-5 md:mt-12 lg:mt-14">
        <nav className="flex w-full flex-row items-center justify-start overflow-hidden">
          <Link
            className="truncate text-gray-600 hover:text-gray-900 hover:underline"
            href="/"
          >
            Home
          </Link>
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
