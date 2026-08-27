import { Form } from "react-router";

export function ArticleCard({
  article,
}: {
  article: { id: string; title: string; content: string; embedding: unknown };
}) {
  return (
    <div className="p-4 border border-charcoal-700 rounded-xl flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-cream-100">{article.title}</h3>
        <p className="text-sm text-charcoal-400 mt-1">{article.content}</p>
        <p className="text-xs text-charcoal-500 mt-2">
          {article.embedding ? "Embedded" : "Missing embedding"}
        </p>
      </div>
      <Form method="post" className="flex-shrink-0">
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={article.id} />
        <button
          type="submit"
          className="text-xs text-accent-400 hover:text-accent-500 transition-colors"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}