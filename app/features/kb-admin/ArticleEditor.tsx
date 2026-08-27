import { Form } from "react-router";

export function ArticleEditor() {
  return (
    <Form method="post" className="mb-8 space-y-3">
      <input
        name="title"
        placeholder="Article title"
        required
        className="w-full rounded-lg bg-charcoal-800 border border-charcoal-600 px-3 py-2 text-sm text-cream-100"
      />
      <textarea
        name="content"
        placeholder="Article content"
        required
        rows={3}
        className="w-full rounded-lg bg-charcoal-800 border border-charcoal-600 px-3 py-2 text-sm text-cream-100"
      />
      <button
        type="submit"
        name="intent"
        value="create"
        className="px-4 py-2 bg-accent-500 rounded-lg text-sm font-medium text-white"
      >
        Add Article
      </button>
    </Form>
  );
}