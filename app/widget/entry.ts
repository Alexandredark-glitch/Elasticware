import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";
import widgetStyles from "./styles.css?inline";


export type Sender = "customer" | "bot" | "agent";

export type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
};

type State = {
  orgKey: string;
  sessionId: string;
  ticketId: string | null;
  messages: ChatMessage[];
  isOpen: boolean;
  pending: boolean;
  error: string | null;
};

type Actions = {
  toggle: () => void;
  send: (text: string) => void;
  endChat: () => void;
};


/* ─── Constants ─── */
const createBotGreeting = (): ChatMessage => ({
  id: "greeting",
  sender: "bot",
  text: "Welcome to Elasticware! I'm your assistant. Ask me about returns, shipping, or anything else — I'm here to help.",
  timestamp: Date.now(),
});

const BOT_GREETING = createBotGreeting;


const CLS = {
  widget: "eb-widget",
  toggle: "eb-toggle",
  window: "eb-window",
  error: "eb-error",
  header: "eb-header",
  headerActions: "eb-header-actions",
  btnEnd: "eb-btn-end",
  btnClose: "eb-btn-close",
  messages: "eb-messages",
  sending: "eb-sending",
  composer: "eb-composer",
  input: "eb-input",
  send: "eb-send",
  row: "eb-row",
  bubble: "eb-bubble",
  label: "eb-label",
  labelDot: "eb-label-dot",
  labelDotBot: "eb-label-dot--bot",
  labelDotAgent: "eb-label-dot--agent",
  labelDotInner: "eb-label-dot-inner",
  labelText: "eb-label-text",
  labelTextBot: "eb-label-text--bot",
  labelTextAgent: "eb-label-text--agent",
} as const;
let __supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

/* ─── Config ─── */


function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Record<string, unknown>,
  children?: (Node | string | null | undefined)[]
): HTMLElementTagNameMap[K];

function h(
  tag: string,
  props?: Record<string, unknown>,
  children?: (Node | string | null | undefined)[]
): HTMLElement;

function h(
  tag: string,
  props?: Record<string, unknown>,
  children?: (Node | string | null | undefined)[]
): HTMLElement {
  const el = document.createElement(tag);
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (val == null) return;
      if (key === "className") el.className = String(val);
      else if (key === "textContent") el.textContent = String(val);
      else if (key === "innerHTML") el.innerHTML = String(val);
      else if (key.startsWith("on") && typeof val === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), val as EventListener);
      } else if (key === "style" && typeof val === "object") {
        Object.assign(el.style, val);
      } else if (typeof val === "boolean") {
        (el as any)[key] = val;
      } else if (key.startsWith("aria")) {
        const attr = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        el.setAttribute(attr, String(val));
      } else {
        el.setAttribute(key, String(val));
      }
    });
  }
  if (children) {
    children.forEach((child) => {
      if (child == null) return;
      el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
  }
  return el;
}

function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  props?: Record<string, unknown>,
  children?: (Node | string | null | undefined)[]
): SVGElementTagNameMap[K] {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (val == null) return;
      if (key === "className") el.setAttribute("class", String(val));
      else if (key === "textContent") el.textContent = String(val);
      else if (key === "innerHTML") el.innerHTML = String(val);
      else if (key.startsWith("on") && typeof val === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), val as EventListener);
      } else if (key === "style" && typeof val === "object") {
        Object.assign((el as unknown as HTMLElement).style, val);
      } else {
        el.setAttribute(key, String(val));
      }
    });
  }
  if (children) {
    children.forEach((child) => {
      if (child == null) return;
      el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
  }
  return el;
}

/* ─── Utilities ─── */
const getScript = (): HTMLScriptElement => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('script[src*="widget"]');
  const el = scripts[scripts.length - 1];
  if (!el) throw new Error("ElasticBot: script tag not found");
  return el;
};

const lsKey = (org: string, key: string) => `eb_${org}_${key}`;

const getApiBase = (script: HTMLScriptElement): string => {
  const explicit = script.dataset.apiBase;
  if (explicit) return explicit;
  const u = new URL(script.src);
  return `${u.protocol}//${u.host}`;
};

const mountShadow = () => {
  const existing = document.getElementById("eb-widget-host");
  if (existing) {
    existing.remove();
  }
  const host = document.createElement("div");
  host.id = "eb-widget-host";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";
  shadow.appendChild(fontLink);
  shadow.appendChild(h("style", { textContent: widgetStyles }));
  return shadow;
};

/* ─── Token ─── */
const fetchWidgetToken = async (
  apiBase: string,
  sessionId: string,
  orgKey: string
): Promise<string> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(`${apiBase}/api/widget-auth`, {
      method: "POST",
      body: new URLSearchParams({ session_id: sessionId, org_key: orgKey }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Auth failed");
    return data.token;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Auth request timed out");
    }
    throw err;
  }
};

/* ─── Data ─── */
const fetchHistory = async (
  supabase: ReturnType<typeof createClient<Database>>,
  ticketId: string
): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender, content, created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`History fetch failed: ${error.message}`);
  if (!data) return [];
  return data.map((m) => ({
    id: m.id,
    sender: m.sender as Sender,
    text: m.content,
    timestamp: new Date(m.created_at).getTime(),
  }));
};

/* ─── Components ─── */
const svgIcon = (paths: string) =>
  s("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    innerHTML: paths,
  });

const createMessageBubble = (msg: ChatMessage): HTMLElement => {
  const isBot = msg.sender === "bot";
  const isAgent = msg.sender === "agent";
  const isExternal = isBot || isAgent;

  const bubble = h("div", { className: `${CLS.bubble} ${CLS.bubble}--${msg.sender}` }, [
    isExternal
      ? h("div", { className: CLS.label }, [
          h(
            "span",
            { className: `${CLS.labelDot} ${isBot ? CLS.labelDotBot : CLS.labelDotAgent}` },
            [h("span", { className: CLS.labelDotInner })]
          ),
          h(
            "span",
            { className: `${CLS.labelText} ${isBot ? CLS.labelTextBot : CLS.labelTextAgent}` },
            [isBot ? "ElasticBot" : "Agent"]
          ),
        ])
      : null,
    h("p", { textContent: msg.text }),
  ]);

  return h("div", { className: `${CLS.row} ${CLS.row}--${msg.sender}` }, [bubble]);
};

const renderMessages = (container: HTMLDivElement, messages: ChatMessage[]) => {
  const messageMap = new Map<string, HTMLElement>();
  container.querySelectorAll(`.${CLS.row}`).forEach((el) => {
    const id = (el as HTMLElement).dataset.msgId;
    if (id) messageMap.set(id, el as HTMLElement);
  });

  // Remove orphaned DOM nodes (e.g., replaced optimistic messages)
  messageMap.forEach((el, id) => {
    if (!messages.some((m) => m.id === id)) {
      el.remove();
      messageMap.delete(id);
    }
  });

  // Append only new messages
  messages.forEach((msg) => {
    if (!messageMap.has(msg.id)) {
      const row = createMessageBubble(msg);
      row.dataset.msgId = msg.id;
      container.appendChild(row);
    }
  });
};

const buildHeader = (state: State, actions: Actions): HTMLElement => {
  const actionsDiv = h("div", { className: CLS.headerActions }, [
    state.ticketId
      ? h("button", { className: CLS.btnEnd, textContent: "End chat", onclick: actions.endChat })
      : null,
    h(
      "button",
      { className: CLS.btnClose, ariaLabel: "Close chat", onclick: actions.toggle },
      [svgIcon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>')]
    ),
  ]);

  return h("div", { className: CLS.header }, [
    h("div", { className: "eb-header-left" }, [
      h("div", { className: "eb-avatar" }, [h("div", { className: "eb-avatar-dot" })]),
      h("div", {}, [
        h("p", { className: "eb-header-name", textContent: "ElasticBot" }),
        h("p", { className: "eb-header-status", textContent: "Online now" }),
      ]),
    ]),
    actionsDiv,
  ]);
};

const buildComposer = (state: State, actions: Actions): HTMLElement => {
  const input = h("input", {
    type: "text",
    className: CLS.input,
    placeholder: "Type a message...",
    disabled: state.pending,
    autocomplete: "off",
  }) as HTMLInputElement;

  return h(
    "form",
    {
      className: CLS.composer,
      onsubmit: (e: Event) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          actions.send(text);
          input.value = "";
        }
      },
    },
    [
      input,
      h(
        "button",
        {
          type: "submit",
          className: CLS.send,
          disabled: state.pending,
          ariaLabel: "Send message",
        },
        [svgIcon('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>')]
      ),
    ]
  );
};

const buildWindow = (root: HTMLDivElement, state: State, actions: Actions) => {
  const win = h("div", { className: CLS.window });

  const errorEl = h("div", {
    className: CLS.error,
    style: { display: state.error ? "block" : "none" },
    textContent: state.error ? `Failed to send: ${state.error}` : "",
  });

  const list = h("div", { className: CLS.messages });
  renderMessages(list, state.messages);

  const sendingEl = h("div", {
    className: CLS.sending,
    textContent: "Sending…",
    style: { display: state.pending ? "block" : "none" },
  });

  [errorEl, buildHeader(state, actions), list, sendingEl, buildComposer(state, actions)].forEach((el) => {
    if (el) win.appendChild(el);
  });

  root.appendChild(win);  // ← THIS WAS MISSING

  requestAnimationFrame(() => {
    list.scrollTop = list.scrollHeight;
  });
};

/* ─── Update (incremental, no rebuild) ─── */
const updateWindow = (root: HTMLDivElement, state: State, actions: Actions) => {
  const win = root.querySelector<HTMLDivElement>(`.${CLS.window}`);
  if (!win) return;

  const err = win.querySelector<HTMLDivElement>(`.${CLS.error}`);
  if (err) {
    err.style.display = state.error ? "block" : "none";
    if (state.error) err.textContent = `Failed to send: ${state.error}`;
  }

  const actionsDiv = win.querySelector<HTMLDivElement>(`.${CLS.headerActions}`);
  if (actionsDiv) {
    const hasEndBtn = actionsDiv.querySelector(`.${CLS.btnEnd}`);
    if (state.ticketId && !hasEndBtn) {
      actionsDiv.insertBefore(
        h("button", { className: CLS.btnEnd, textContent: "End chat", onclick: actions.endChat }),
        actionsDiv.firstChild
      );
    } else if (!state.ticketId && hasEndBtn) {
      hasEndBtn.remove();
    }
  }

  const list = win.querySelector<HTMLDivElement>(`.${CLS.messages}`);
  if (list) {
    renderMessages(list, state.messages);
    requestAnimationFrame(() => {
      list.scrollTop = list.scrollHeight;
    });
  }

  const sending = win.querySelector<HTMLDivElement>(`.${CLS.sending}`);
  if (sending) sending.style.display = state.pending ? "block" : "none";

  const input = win.querySelector<HTMLInputElement>(`.${CLS.input}`);
  if (input) input.disabled = state.pending;

  const btn = win.querySelector<HTMLButtonElement>(`.${CLS.send}`);
  if (btn) btn.disabled = state.pending;
};

/* ─── Main render ─── */
const render = (shadow: ShadowRoot, state: State, actions: Actions) => {
  let root = shadow.querySelector<HTMLDivElement>(`.${CLS.widget}`);
  if (!root) {
    root = h("div", { className: CLS.widget });
    shadow.appendChild(root);
  }

  const wasOpen = root.dataset.open === "true";
  const isOpen = state.isOpen;

  if (!isOpen) {
    if (wasOpen) {
      root.innerHTML = "";
      root.dataset.open = "false";
    }
    if (!root.querySelector(`.${CLS.toggle}`)) {
      const btn = h(
        "button",
        { className: CLS.toggle, onclick: actions.toggle },
        [
          svgIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
          "Chat with us",
        ]
      );
      root.appendChild(btn);
    }
    return;
  }

  if (!wasOpen) {
    root.innerHTML = "";
    root.dataset.open = "true";
    buildWindow(root, state, actions);
  } else {
    updateWindow(root, state, actions);
  }
};

/* ─── Bootstrap ─── */
/* ─── Bootstrap ─── */
async function init() {
  if (typeof window === "undefined") return;

   if (__supabaseClient) {
    await __supabaseClient.removeAllChannels();
    __supabaseClient = null;
  }

  const script = getScript();
  const orgKey = script.dataset.orgKey;
  if (!orgKey) {
    console.error("ElasticBot: add data-org-key to your script tag");
    return;
  }

  const apiBase = getApiBase(script);
  const shadow = mountShadow();

  const state: State = {
    orgKey,
    sessionId: localStorage.getItem(lsKey(orgKey, "session")) || crypto.randomUUID(),
    ticketId: localStorage.getItem(lsKey(orgKey, "ticket")),
    messages: [createBotGreeting()],
    isOpen: false,
    pending: false,
    error: null,
  };

  localStorage.setItem(lsKey(orgKey, "session"), state.sessionId);

  /* ─── Authenticate with Supabase ─── */
  let supabase: ReturnType<typeof createClient<Database>>;
  try {
    const token = await fetchWidgetToken(apiBase, state.sessionId, orgKey);
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("ElasticBot: missing Supabase env vars");
        supabase = createClient<Database>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    supabase.realtime.setAuth(token);
        __supabaseClient = supabase; 
  } catch (err) {
    console.error("ElasticBot: failed to authenticate", err);
    return;
  }

  /* Realtime */
  let msgChannel: ReturnType<typeof supabase.channel> | null = null;
  let ticketChannel: ReturnType<typeof supabase.channel> | null = null;
    const seenMessageIds = new Set<string>();

      const clearChannels = async () => {
    const oldMsg = msgChannel;
    const oldTicket = ticketChannel;
    msgChannel = null;
    ticketChannel = null;
    if (oldMsg) await supabase.removeChannel(oldMsg);
    if (oldTicket) await supabase.removeChannel(oldTicket);
  };

    const clearSession = async () => {
    state.ticketId = null;
    state.messages = [createBotGreeting()];
    state.error = null;
    state.pending = false; 
    seenMessageIds.clear(); 
    localStorage.removeItem(lsKey(orgKey, "ticket"));
    await clearChannels();
  };

         const subscribeToMessages = () => {
    if (!state.ticketId || msgChannel) return;
    const subscribedTicketId = state.ticketId;

    msgChannel = supabase
      .channel(`widget-msgs-${state.ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `ticket_id=eq.${state.ticketId}`,
        },
        (payload) => {
          const raw = payload.new as { id: string; sender: string; content: string; ticket_id?: string };

          // CRITICAL: ignore events from old tickets that fire after clearSession
          if (raw.ticket_id && raw.ticket_id !== state.ticketId) return;
          if (subscribedTicketId !== state.ticketId) return;
          if (seenMessageIds.has(raw.id)) return;
          seenMessageIds.add(raw.id);

          // Search backwards for matching optimistic message
          let replaced = false;
          for (let i = state.messages.length - 1; i >= 0; i--) {
            const m = state.messages[i];
            if (m.id.startsWith("cust-") && m.sender === "customer" && m.text === raw.content) {
              state.messages[i] = {
                id: raw.id,
                sender: raw.sender as Sender,
                text: raw.content,
                timestamp: Date.now(),
              };
              replaced = true;
              break;
            }
          }

          if (!replaced) {
            state.messages.push({
              id: raw.id,
              sender: raw.sender as Sender,
              text: raw.content,
              timestamp: Date.now(),
            });
          }
          render(shadow, state, actions);
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED" || err) {
          console.error(`[Realtime] Message subscription ${status}:`, err);
          msgChannel = null;
        }
      });
  };

          const subscribeToTicket = () => {
    if (!state.ticketId || ticketChannel) return;
    const subscribedTicketId = state.ticketId;

    ticketChannel = supabase
      .channel(`widget-ticket-${state.ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
          filter: `id=eq.${state.ticketId}`,
        },
        async (payload) => {
          const raw = payload.new as { status: string; id: string };

          // CRITICAL: ignore events from old tickets that fire after clearSession
          if (raw.id !== state.ticketId || subscribedTicketId !== state.ticketId) return;

          if (raw.status === "resolved") {
            await clearSession();
            render(shadow, state, actions);
          } else if (raw.status === "open") {
            render(shadow, state, actions);
          }
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED" || err) {
          console.error(`[Realtime] Ticket subscription ${status}:`, err);
          ticketChannel = null;
        }
      });
  };

    if (state.ticketId) {
    subscribeToMessages();
    subscribeToTicket();
    fetchHistory(supabase, state.ticketId).then((history) => {
      state.messages = [createBotGreeting(), ...history];
      history.forEach((m) => seenMessageIds.add(m.id));
      render(shadow, state, actions);
    }).catch((err) => {
      console.error("ElasticBot: failed to load history", err);
    });
  }

  /* Actions */
  const actions: Actions = {
    toggle: () => {
      state.isOpen = !state.isOpen;
      render(shadow, state, actions);
    },

    endChat: async () => {
      if (!state.ticketId) return;
      try {
        const res = await fetch(`${apiBase}/api/tickets`, {
          method: "POST",
          body: new URLSearchParams({
            intent: "resolve",
            ticket_id: state.ticketId,
            session_id: state.sessionId,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          state.error = data.error || "Failed to end chat";
          render(shadow, state, actions);
          return;
        }
      } catch (err) {
        console.error("ElasticBot: network error resolving ticket", err);
        state.error = "Network error. Please try again.";
        render(shadow, state, actions);
        return;
      }
      await clearSession();
      render(shadow, state, actions);
    },

    send: async (text: string) => {
      state.pending = true;
      state.error = null;

      // Optimistic: show immediately for every send
      const optimisticId = `cust-${Date.now()}`;
      state.messages.push({
        id: optimisticId,
        sender: "customer",
        text,
        timestamp: Date.now(),
      });
      render(shadow, state, actions);

      try {
        if (!state.ticketId) {
          const res = await fetch(`${apiBase}/api/tickets`, {
            method: "POST",
            body: new URLSearchParams({
              org_key: state.orgKey,
              session_id: state.sessionId,
              content: text,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to create ticket");

          const newTicketId: string = data.ticket_id;
          state.ticketId = newTicketId;
          localStorage.setItem(lsKey(orgKey, "ticket"), newTicketId);

          const history = await fetchHistory(supabase, newTicketId);
          state.messages = [createBotGreeting(), ...history];
          history.forEach((m) => seenMessageIds.add(m.id));
          subscribeToMessages();
          subscribeToTicket();
        } else {
          const res = await fetch(`${apiBase}/api/messages`, {
            method: "POST",
            body: new URLSearchParams({
              ticket_id: state.ticketId,
              sender: "customer",
              content: text,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to send message");
          // Realtime will replace the optimistic message — do NOT push again here
        }
      } catch (err) {
        console.error("ElasticBot:", err);
        // Remove optimistic message on failure
        state.messages = state.messages.filter((m) => m.id !== optimisticId);
        state.error = err instanceof Error ? err.message : "Failed to send";
      } finally {
        state.pending = false;
        render(shadow, state, actions);
      }
    },
  };

  render(shadow, state, actions);
}

init().catch((err) => console.error("ElasticBot: init failed", err));

