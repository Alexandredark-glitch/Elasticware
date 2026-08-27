import { Form, useNavigation } from "react-router";
import { useRef, useEffect } from "react";

export function ArticleEditor() {
  const { state } = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const justFinished = useRef(false);

  useEffect(() => {
    if (state === "submitting" || state === "loading") {
      justFinished.current = true;
    } else if (justFinished.current) {
      justFinished.current = false;
      formRef.current?.reset();
    }
  }, [state]);

  const busy = state !== "idle";

  return (
    <Form ref={formRef} method="post" className="mb-8 space-y-3">
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
        disabled={busy}
        className="px-4 py-2 bg-accent-500 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "Adding..." : "Add Article"}
      </button>
    </Form>
  );
}