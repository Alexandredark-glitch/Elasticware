import type { Route } from "./+types/kb";
import { useLoaderData, useActionData } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useGlobalError } from "~/hooks/useGlobalError";

import { requireAuth } from "~/lib/supabase/auth.server";
import {
  listArticles,
  getOrgSlug,
  createArticle,
  deleteArticle,
  regenerateMissingEmbeddings,
} from "~/services/kb.server";

import { ArticleList } from "~/features/kb-admin/ArticleList";
import { ArticleEditor } from "~/features/kb-admin/ArticleEditor";


type LoaderData = {
  articles: Awaited<ReturnType<typeof listArticles>>;
  orgSlug: string;
};

type ActionData =
  | { ok: true; updated?: number }
  | { ok: false; error: string };

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, orgId, headers } = await requireAuth(request);

  const [articles, orgSlug] = await Promise.all([
    listArticles(supabase, orgId),
    getOrgSlug(supabase, orgId),
  ]);

  return Response.json(
    { articles, orgSlug } satisfies LoaderData,
    { headers }
  );
}


export async function action({ request }: Route.ActionArgs) {
  const { supabase, orgId, headers } = await requireAuth(request);
  const form = await request.formData();
  const intent = form.get("intent");

  try {
    if (intent === "regenerate") {
      const updated = await regenerateMissingEmbeddings(supabase, orgId);
      return Response.json(
        { ok: true, updated } satisfies ActionData,
        { headers }
      );
    }

    if (intent === "create") {
      const title = (form.get("title") as string)?.trim();
      const content = (form.get("content") as string)?.trim();
      if (!title || !content) {
        return Response.json(
          { ok: false, error: "Title and content are required" } satisfies ActionData,
          { headers, status: 400 }
        );
      }
      await createArticle(supabase, orgId, title, content);
      return Response.json({ ok: true } satisfies ActionData, { headers });
    }

    if (intent === "delete") {
      const id = form.get("id") as string;
      if (!id) {
        return Response.json(
          { ok: false, error: "Missing article ID" } satisfies ActionData,
          { headers, status: 400 }
        );
      }
      await deleteArticle(supabase, id);
      return Response.json({ ok: true } satisfies ActionData, { headers });
    }

    return Response.json(
      { ok: false, error: "Unknown intent" } satisfies ActionData,
      { headers, status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return Response.json(
      { ok: false, error: message } satisfies ActionData,
      { headers, status: 500 }
    );
  }
}


function EmbedCodeCard({ orgSlug }: { orgSlug: string }) {
  const [copied, setCopied] = useState(false);


  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://yourdomain.com";

  const embedCode = `<script src="${origin}/widget.js" data-org-key="${orgSlug}"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = embedCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8 rounded-xl border border-charcoal-600 bg-charcoal-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-cream-100">Embed Code</h2>
          <p className="text-sm text-charcoal-400 mt-1">
            Paste this into any website to add your chat widget.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-accent-500 text-white hover:bg-accent-600 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="rounded-lg bg-charcoal-900 border border-charcoal-700 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-teal-300">{embedCode}</code>
      </pre>
    </div>
  );
}


export default function KbRoute() {
  const { articles, orgSlug } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
    const navigate = useNavigate();
      const { setError } = useGlobalError();
       useEffect(() => {
    if (actionData?.ok === false) {
      setError(actionData.error);
    }
  }, [actionData, setError]);


  const justUpdated =
    actionData?.ok && "updated" in actionData ? actionData.updated : null;

  return (
    <div className="min-h-screen bg-charcoal-900 text-cream-100 p-8">
     <button
        onClick={() => navigate(-1)}
        className="p-2 font-bold bg-white border border-pink-500 rounded text-black mb-6 hover:bg-black hover:text-white transition-colors duration-500 ease-in-out"
      >
        {"<-"} Go back
      </button>

      <h1 className="text-2xl font-bold mb-6">Knowledge Base</h1>

      {justUpdated !== null && (
        <p className="text-teal-400 mb-4">Regenerated {justUpdated} articles</p>
      )}

      <EmbedCodeCard orgSlug={orgSlug} />
      <ArticleEditor />
      <ArticleList articles={articles} />
    </div>
  );
}