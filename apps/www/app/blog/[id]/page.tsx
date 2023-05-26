import type { Root } from "mdast";

import type { SC } from "~/server";

import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
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

const Page: SC<PageProps> = async ({ params }) => {
  const content = await getPageContent(params);
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default Page;
