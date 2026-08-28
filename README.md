# Elasticware — Real-Time AI-Powered Customer Support Platform




<img width="1919" height="924" alt="app" src="https://github.com/user-attachments/assets/e23eca30-9f82-42ae-8443-bd77fd92e1e1" />




> A production-grade, multi-tenant customer support platform featuring an embeddable CDN widget, an AI bot brain with RAG (Retrieval-Augmented Generation), and a real-time agent dashboard. Built to demonstrate enterprise-level full-stack architecture, dual-authentication security, and vector-based semantic search.

**Live Demo:** [https://elasticware-bot.vercel.app](https://elasticware-bot.vercel.app)  
**Widget Embed:** `<script src="https://elasticware-bot.vercel.app/widget.js" data-org-key="demo"></script>`

---

Recommended flow:
# Explore home page
# Enter the sandbox
# Try live demo
# Test
# Enter Knowledge base
# Copy CDN
# Test


---


## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [The Three-Layer Runtime Invariant](#the-three-layer-runtime-invariant)
3. [Dual Auth Architecture](#dual-auth-architecture)
4. [The CDN Widget (Vanilla JS)](#the-cdn-widget-vanilla-js)
5. [The Agent Dashboard (React Router)](#the-agent-dashboard-react-router)
6. [The Bot Brain (RAG Pipeline)](#the-bot-brain-rag-pipeline)
7. [Database Schema & RLS](#database-schema--rls)
8. [Hook Architecture (React Widget)](#hook-architecture-react-widget)
9. [API Routes & Server Security](#api-routes--server-security)
10. [Build Pipeline & Deployment](#build-pipeline--deployment)
11. [Tech Stack](#tech-stack)
12. [Key Design Decisions](#key-design-decisions)


---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              THIRD-PARTY WEBSITE                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CDN WIDGET (Vanilla JS, Shadow DOM, IIFE)                         │    │
│  │  • Generates session_id + ticket_id in localStorage                │    │
│  │  • POSTs to /api/widget-auth → receives signed JWT               │    │
│  │  • Subscribes to Supabase Realtime via authenticated WebSocket     │    │
│  │  • Renders chat UI inside Shadow DOM (CSS isolation)               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                              │
│                              ▼                                              │
│                    POST /api/widget-auth                                    │
│                    WebSocket wss://...supabase.co                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL EDGE / SERVERLESS                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ /api/widget-auth│  │ /api/tickets    │  │ /api/messages               │  │
│  │ • Signs JWT     │  │ • Create ticket │  │ • Ingest customer msg      │  │
│  │ • Validates org │  │ • Resolve ticket│  │ • Ingest agent msg         │  │
│  │ • Returns token │  │ • Delete ticket │  │ • Triggers bot pipeline    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  BOT BRAIN (Server-side RAG Pipeline)                              │    │
│  │  • Sanity check (≤2000 chars)                                      │    │
│  │  • Gemini text-embedding-004 → 768-dim vector                      │    │
│  │  • pgvector match_kb_articles (cosine similarity, threshold 0.4)   │    │
│  │  • Gemini gemini-3.1-flash-lite → constrained answer generation    │    │
│  │  • Uncertainty detection → auto-escalate to human                  │    │
│  │  • Error resilience → any failure escalates, never breaks chat     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE (Single Source of Truth)              │
│  ┌─────────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │organizations│  │ agents  │  │ tickets │  │ messages │  │ kb_articles │  │
│  │  (tenants)  │  │(ident.) │  │(threads)│  │ (chat)   │  │ (vectors)   │  │
│  └─────────────┘  └─────────┘  └─────────┘  └──────────┘  └─────────────┘  │
│                                                                             │
│  • PostgreSQL 15 + pgvector extension                                       │
│  • Realtime WebSocket broadcasts INSERT/UPDATE to all subscribers           │
│  • Row Level Security (RLS) enforces tenant isolation at the DB layer       │
│  • match_kb_articles RPC for semantic search                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AGENT BROWSER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  DASHBOARD (React Router V8, Full-Stack Framework Mode)            │    │
│  │  • Supabase Auth cookie session                                    │    │
│  │  • Realtime subscription on tickets table (org-scoped)             │    │
│  │  • Ticket queue with status filters (bot_handling | open | resolved)│   │
│  │  • KB article CRUD with embedding generation                       │    │
│  │  • Embed code generator with dynamic origin                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                              │
│                              ▼                                              │
│                    Cookie auth + Supabase Realtime                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Three-Layer Runtime Invariant

The system enforces a strict separation: **three runtime environments that never share memory.**

| Layer | Holds | Auth | Supabase Client |
|-------|-------|------|-----------------|
| **Customer Browser** | `session_id`, `ticket_id` in localStorage (scoped by `org_key`) | Custom JWT signed by server | Anon key + `realtime.setAuth(token)` |
| **Agent Browser** | Cookie-based session | Supabase Auth UUID | `createBrowserClient` from `@supabase/ssr` |
| **Supabase** | PostgreSQL + Realtime | — | The **only** shared source of truth |

**The critical rule:** When an agent replies, Supabase pushes the `INSERT` to both independent subscribers. Each layer invalidates its own cache and refetches. There is no shared state, no broadcast channel, no memory leak between customer and agent.

---

## Dual Auth Architecture

The platform does not use one auth system. It uses **three, each purpose-built**:

| Layer | Auth Mechanism | Identity | Why This Mechanism |
|-------|---------------|----------|-------------------|
| **Widget (browser)** | Custom JWT signed by server | `session_id` (anonymous UUID) | Widget lives on third-party domains — cookies don't cross origins |
| **Dashboard (browser)** | Supabase Auth cookie | Agent's Supabase Auth UUID | Agents need persistent sessions across page reloads |
| **Server (API routes)** | Service role key | None (god mode for reads) | RLS intentionally blocks anonymous reads; server needs visibility |

**Why this matters:** A single auth system cannot serve both an anonymous cross-origin widget and a logged-in same-origin dashboard. The dual-auth model isolates each surface area while maintaining a unified data layer.

---

## The CDN Widget (Vanilla JS)

A **zero-dependency, vanilla JavaScript IIFE bundle** that any third-party website embeds with a single `<script>` tag:

```html
<script src="https://elasticware-bot.vercel.app/widget.js" data-org-key="demo"></script>
```

### Key Characteristics

- **Shadow DOM isolation** — mounts into a closed Shadow root to prevent CSS leakage from/to the host website
- **No framework dependency** — pure TypeScript, manual DOM diffing, event listeners attached directly
- **IIFE format** — executes immediately upon injection, no module loader required
- **Bundle size:** ~225KB gzipped (includes Supabase realtime client)
- **Auth sequence:**
  1. Generate/retrieve `session_id` from `localStorage` (key scoped by `org_key`)
  2. POST `session_id` + `org_key` to `/api/widget-auth`
  3. Receive signed JWT with `sub: session_id`, `org_id`, `exp: now + 3600`
  4. Create Supabase client with `persistSession: false` (token lives in closure, never storage)
  5. Call `supabase.realtime.setAuth(token)` before opening WebSocket
  6. Subscribe to `messages` INSERT events scoped to `ticket_id`

### Manual Hook Reimplementation

Because the CDN widget cannot use React hooks, it manually sequences the same four responsibilities:

```
Identity (session_id) → Auth (JWT) → Data (messages fetch) → Realtime (WebSocket)
```

Each responsibility is a plain function. No closures leak between them. The widget is **interchangeable** with the React widget from the server's perspective — both produce identical database state.

---

## The Agent Dashboard (React Router)

A full-stack React Router V8 application running in **framework mode** (server-side rendering + client hydration).

### Key Features

- **Cookie-based auth** via Supabase Auth + `@supabase/ssr` — sessions persist across reloads
- **Real-time ticket queue** — subscribes to `*` (all events) on the `tickets` table, filtered by agent's `org_id`
- **Status lifecycle** — `bot_handling` → `open` → `resolved`, with real-time pushes on every transition
- **KB article management** — CRUD interface with automatic embedding generation on save
- **Embed code generator** — dynamically constructs the `<script>` tag with the correct origin

### Database-First State Model

The React widget eliminated local message state entirely. Messages are computed at render time from:
- `useTicketMessages(ticketId)` (React Query + realtime invalidation)
- `BOT_GREETING` constant
- Optional optimistic message

When `ticketId` becomes `null` (end chat), `useTicketMessages(null)` returns `[]`, and the computed messages naturally becomes `[BOT_GREETING]`. This killed the "resurrection bug" where old messages reappeared after ending a chat.

---

## The Bot Brain (RAG Pipeline)

When a customer sends a message and `ticket.status === "bot_handling"`, this server-side sequence runs:

### 1. Sanity Check
If the message exceeds 2000 characters, escalate immediately. Prevents token burning and abuse.

### 2. Embed the Question
Text is sent to **Gemini `text-embedding-004`**. Returns a 768-dimensional vector. Happens server-side — the API key never touches the browser.

### 3. Search the Knowledge Base
Vector is passed to `match_kb_articles`, scoped to the ticket's `org_id`:
- **Similarity metric:** Cosine similarity (1.0 = identical meaning)
- **Threshold:** 0.4 (intentionally loose — prefers false positives over false negatives)
- **Limit:** 3 articles
- **Tenant isolation:** Customer talking to Org A never sees Org B's articles

### 4. Decision Gate — No Matches
If similarity is below threshold or no articles exist:
- Insert bot message: *"I don't know. Let me connect you with an agent."*
- Update ticket status to `"open"`
- Stop

### 5. Decision Gate — Matches Found
Top articles are formatted into a prompt context:
```
Use ONLY the following docs. Be concise. If the answer is not in the docs, say 'I don't know.'

Doc 1: [title]
[content]

Doc 2: ...
```

### 6. Generate Reply
Prompt sent to **Gemini `gemini-3.1-flash-lite`**. Response extracted from API shape.

### 7. Uncertainty Check
If the reply contains `"don't know"`, `"not sure"`, `"no information"`, or `"unable to answer"`:
- Escalate instead of showing the message
- Prevents useless bot replies from reaching the customer

### 8. Success Path
Bot inserts reply into `messages` with `sender: "bot"`. Ticket stays `"bot_handling"`.

### Error Resilience Philosophy

If `handleBotReply` throws (Gemini down, API key invalid, network fails):
- Log error to server console
- Escalate ticket to `"open"`
- **Do not fail the customer's message**

The customer's message is already saved before the bot runs. The worst case is a human agent sees the ticket. A broken bot never breaks the core chat.

---

## Database Schema & RLS

### Tables

```sql
organizations    -- Tenant table. slug = public org_key read by widget.
  └─ id (uuid PK), slug (text unique), name (text), created_at (timestamptz)

agents           -- Links Supabase Auth users to the application.
  └─ id (uuid PK → auth.users), org_id (uuid FK), email, name, role, created_at
  └─ RLS: agents can only see/modify their own row (id = auth.uid())

tickets          -- Core conversation thread.
  └─ id (uuid PK), org_id (uuid FK), customer_session_id (text), status (text)
  └─ subject, preview, created_at, updated_at
  └─ RLS: widget sees own session; agents see org-scoped

messages         -- Append-only conversation log.
  └─ id (uuid PK), ticket_id (uuid FK), sender (text), content (text), created_at
  └─ RLS: same scoping as tickets

kb_articles      -- Bot knowledge base with vector embeddings.
  └─ id (uuid PK), org_id (uuid FK), title, content, embedding (vector(768))
  └─ RLS: agents manage their org's articles exclusively
```

### Vector Search

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE OR REPLACE FUNCTION match_kb_articles(
  query_embedding vector(768),
  match_org_id uuid,
  match_threshold double precision,
  match_count integer
)
RETURNS TABLE(id uuid, title text, content text, similarity double precision)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    kb_articles.id,
    kb_articles.title,
    kb_articles.content,
    1 - (kb_articles.embedding <=> query_embedding) AS similarity
  FROM kb_articles
  WHERE kb_articles.org_id = match_org_id
    AND 1 - (kb_articles.embedding <=> query_embedding) > match_threshold
  ORDER BY kb_articles.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### RLS Policy Summary

| Table | Public (Widget) | Authenticated (Agent) |
|-------|----------------|----------------------|
| `organizations` | SELECT all | INSERT |
| `agents` | — | SELECT/INSERT/UPDATE self only |
| `tickets` | SELECT/INSERT own session; UPDATE own status | Full CRUD on org-scoped |
| `messages` | SELECT own thread; INSERT | SELECT org-scoped |
| `kb_articles` | — | Full CRUD on org-scoped |

---

## Hook Architecture (React Widget)

The React widget is composed of four hooks that feed into each other sequentially:

```
useWidgetSession(orgKey)
  ├─ Generates/retrieves session_id from localStorage (scoped by orgKey)
  ├─ Generates/retrieves active ticket_id
  ├─ Provides clearSession() — wipes keys, regenerates UUID
  └─ Owns: "Who is this anonymous user?"
       ↓
useWidgetSupabase(sessionId, orgKey)
  ├─ POSTs session_id + org_key to /api/widget-auth
  ├─ Receives signed JWT
  ├─ Creates Supabase client with persistSession: false
  ├─ Calls supabase.realtime.setAuth(token)
  ├─ Exponential backoff retry (3 attempts)
  └─ Owns: "How do we prove this identity to Supabase?"
       ↓
useTicketMessages(ticketId, client)
  ├─ React Query fetch with queryKey including "scoped" vs "global"
  ├─ Auto-refetch when JWT client replaces anon fallback
  ├─ Subscribes to realtime INSERT via useSupabaseRealtime
  └─ Owns: "What messages can this proven identity see?"
       ↓
useSupabaseRealtime(...)
  ├─ Creates unique channel per instance (crypto.randomUUID() suffix)
  ├─ Listens for postgres_changes events
  ├─ Calls queryClient.invalidateQueries() on every event
  ├─ Cleans up channel on unmount
  └─ Owns: "When the database changes, tell React Query to refetch."
```

**Why this separation matters:**
- Test `useWidgetSession` without a network connection
- Test `useWidgetSupabase` without caring about messages
- Test `useTicketMessages` with a mock client
- The CDN widget reimplements the same logic manually

---

## API Routes & Server Security

### Three Public Endpoints

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `POST /api/widget-auth` | Issues signed JWT for widget | Public (validates org_key exists) |
| `POST /api/tickets` | Create / resolve / delete tickets | Dual: cookie auth OR session_id |
| `POST /api/messages` | Ingest customer or agent messages | Dual: public insert OR cookie auth |

### The Server-Derived Sender Pattern

The client claims a role (`sender: "customer"` or `sender: "agent"`), but the **server discards it and derives the real role from authentication**:

```ts
// Customer path: uses supabaseApi (anon key), RLS validates via public policy
// Agent path: calls requireAuth(), overwrites sender with "agent", uses auth.supabase
```

A customer cannot fake being an agent. The security boundary is authentication, not client-side claims.

### Service Role + Auth Write Pattern

```
Read  → supabaseService (bypasses RLS, server needs status/org_id)
      ↓
Logic → Validate input, decide what to do
      ↓
Write → supabaseApi (customer) or auth.supabase (agent)
        (RLS validates the write)
```

**Why this is correct:** The server reads with god privileges because RLS intentionally blocks anonymous reads. But the server writes with user privileges to validate that the RLS policies actually work. This is defense in depth.

### CORS Model

Because the CDN widget lives on third-party domains:
- Every public route handles `OPTIONS` preflight
- Every response includes `Access-Control-Allow-Origin: *`

`Access-Control-Allow-Origin: *` is safe here because the widget is anonymous. There are no cookies or sessions to steal via CSRF. The real security boundary is RLS, not CORS.

---

## Build Pipeline & Deployment

### Dual Build Pipeline

The project produces **two separate artifacts** from one codebase:

```
1. Widget Build (vite.widget.config.ts) → public/widget.js
2. App Build   (vite.config.ts)        → build/ (copies public/ into artifact)
```

**Chained in package.json:**
```json
"build": "npm run build:widget && react-router build"
```

**Why this order matters:** If React Router builds first, it copies the old (or missing) `widget.js` into the deploy artifact. Then the widget build runs and writes to `public/` — but the artifact is already sealed.

### Widget Build Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| `publicDir: false` | — | Widget build produces the asset, doesn't consume it |
| `formats: ["iife"]` | — | Must execute immediately on any site without module loader |
| `outDir: "public"` | — | React Router copies `public/` into `build/client/` |
| `emptyOutDir: false` | — | Don't wipe favicons/fonts already in `public/` |

### Vercel Configuration

- **Framework Preset:** React Router (auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `build/` (auto-detected)
- **No Vercel preset in vite.config.ts** — React Router V8 framework mode is handled at the platform level

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React Router | V8 (framework mode) |
| UI Library | React | v19 |
| Styling | Tailwind CSS | v4 |
| State Management | TanStack Query | v5 |
| Realtime | Supabase Realtime | — |
| Auth (Dashboard) | Supabase Auth + @supabase/ssr | — |
| Auth (Widget) | Custom JWT (HS256, crypto.subtle) | — |
| Database | Supabase PostgreSQL | 15 |
| Vector Search | pgvector | — |
| AI Embeddings | Google Gemini | text-embedding-004 |
| AI Generation | Google Gemini | gemini-3.1-flash-lite |
| Widget | Vanilla TypeScript | — |
| Build Tool | Vite | v8 |
| Deploy | Vercel | Serverless |
| Monitoring | Sentry | @sentry/react + @sentry/node |

---

## Key Design Decisions

### Why Dual Auth Instead of One System?

The widget lives on third-party domains — cookies don't cross origins. The dashboard needs persistent sessions. One auth system cannot serve both. The custom JWT is scoped to exactly one browser session and one organization, minimizing blast radius if leaked.

### Why Database-First State?

Eliminated local message state entirely. The database is the single source of truth. When `ticketId` becomes `null` (end chat), computed messages naturally reset to `[BOT_GREETING]`. No local state holds old data that could "resurrect" after a chat ends.

### Why Service-Role-Read + Auth-Write?

RLS intentionally blocks anonymous reads. The server needs god-mode reads to check ticket status before triggering the bot. But writes go through user-privileged clients to validate that RLS policies actually enforce the security model. This is defense in depth — if RLS has a bug, the server's write will fail.

### Why Vanilla JS for the Widget?

Proves the architecture is framework-agnostic. The widget and React widget are interchangeable from the server's perspective. Also keeps the bundle tiny for third-party embeds — no React, no JSX, no virtual DOM overhead.

### Why pgvector Instead of Pinecone/Weaviate?

Colocating vectors with relational data eliminates network hops. The `match_kb_articles` function is a single SQL query: filter by `org_id`, compute similarity, rank, limit. No HTTP round-trips, no eventual consistency, no separate infrastructure to manage.

### Why 0.4 Similarity Threshold?

Intentionally loose. Prefer false positives (bot tries to answer, might be slightly wrong) over false negatives (bot escalates immediately, customer waits for human). The uncertainty check catches low-confidence answers before they reach the customer.

---
