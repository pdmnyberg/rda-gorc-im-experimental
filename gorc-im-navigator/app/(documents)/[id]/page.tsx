import fs from "fs";
import path from "path";
import fm from "front-matter";
import Markdown from "react-markdown";

const dataDir = "public/documents";

export function generateStaticParams() {
  const paths = fs.readdirSync(dataDir)
    .map(file => path.basename(file))
    .filter(name => name.endsWith(".md"))
    .map(name => ({id: name.replace(".md", "")}));
  return paths;
};

export default async function DocumentPage({params}: {params: Promise<{ id: string }>}) {
  const {id} = await params;
  const data = fs.readFileSync(`${dataDir}/${id}.md`, "utf8");
  const content = fm(data);
  const attributes = typeof content.attributes === "object" && content.attributes !== null ?  content.attributes : {};

  return (
    <div className="container mt-4">
      {"title" in attributes ? <h2>{String(attributes.title)}</h2> : undefined}
      <Markdown>{content.body}</Markdown>
    </div>
  )
};