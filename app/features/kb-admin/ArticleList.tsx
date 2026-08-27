import { ArticleCard } from "./ArticleCard";

type Article = { id: string; title: string; content: string; embedding: unknown };

export function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="space-y-4">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}