import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";
import { embedText } from "~/lib/ai/gemini.server";

export type Article = {
  id: string;
  title: string;
  content: string;
  embedding: unknown;
};


export async function listArticles(
  supabase: SupabaseClient<Database>,
  orgId: string
): Promise<Article[]> {
  const { data, error } = await supabase
    .from("kb_articles")
    .select("id, title, content, embedding, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to list articles: ${error.message}`);
  return (data ?? []) as Article[];
}

export async function getOrgSlug(
  supabase: SupabaseClient<Database>,
  orgId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("organizations")
    .select("slug")
    .eq("id", orgId)
    .single();

  if (error || !data) throw new Error("Organization not found");
  return data.slug;
}


export async function createArticle(
  supabase: SupabaseClient<Database>,
  orgId: string,
  title: string,
  content: string
): Promise<void> {
  const embedding = await embedText(content);

  const { error } = await supabase.from("kb_articles").insert({
    org_id: orgId,
    title,
    content,
    embedding: embedding as unknown as string,
  });

  if (error) throw new Error(`Failed to create article: ${error.message}`);
}

export async function deleteArticle(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase.from("kb_articles").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete article: ${error.message}`);
}


export async function regenerateMissingEmbeddings(
  supabase: SupabaseClient<Database>,
  orgId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("kb_articles")
    .select("id, content")
    .eq("org_id", orgId)
    .is("embedding", null);

  if (error) throw new Error(`Failed to fetch articles: ${error.message}`);

  const articles = data ?? [];
  if (articles.length === 0) return 0;


  const BATCH_SIZE = 5;
  let updated = 0;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);

    const embeddings = await Promise.all(
      batch.map((a) => embedText(a.content))
    );

    await Promise.all(
      batch.map((article, idx) =>
        supabase
          .from("kb_articles")
          .update({ embedding: embeddings[idx] as unknown as string })
          .eq("id", article.id)
      )
    );

    updated += batch.length;
  }

  return updated;
}