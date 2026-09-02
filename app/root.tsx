import "~/lib/sentry.client";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { ErrorProvider } from "~/hooks/useGlobalError";
import { ErrorToast } from "~/features/error/ErrorToast";
import {Analytics} from "@vercel/analytics/react";

import type { Route } from "./+types/root";
import "./app.css";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  const w = window as unknown as { __QUERY_CLIENT__?: QueryClient };
  if (!w.__QUERY_CLIENT__) {
    w.__QUERY_CLIENT__ = makeQueryClient();
  }
  return w.__QUERY_CLIENT__;
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", type: "image/svg+xml", href: "favicon.svg" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics /> 
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(() => getQueryClient());
  const navigation = useNavigation();
  const isNavigating =
    navigation.state === "loading" || navigation.state === "submitting";

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        {isNavigating && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse z-50 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
        )}

        <ErrorToast />

        <div
          className={
            isNavigating
              ? "opacity-75 transition-opacity duration-200 ease-in-out"
              : "transition-opacity duration-200"
          }
        >
          <Sentry.ErrorBoundary
            fallback={({ error }) => (
              <div className="p-8 text-red-600">
                <h1 className="text-xl font-bold">Something went wrong</h1>
                <pre className="mt-2 text-sm">{String(error)}</pre>
              </div>
            )}
          >
            <Outlet />
          </Sentry.ErrorBoundary>
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    message =
      error.status === 404
        ? "The page you are looking for does not exist."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error instanceof Error) {
    message = error.message;
  }

  useEffect(() => {
    if (error && !(isRouteErrorResponse(error) && error.status === 404)) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 mb-8 max-w-md">{message}</p>
      <a
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Go to dashboard
      </a>

      {import.meta.env.DEV && error instanceof Error && error.stack && (
        <pre className="mt-8 w-full max-w-2xl p-4 bg-gray-100 rounded-lg text-left overflow-x-auto text-sm text-gray-800">
          <code>{error.stack}</code>
        </pre>
      )}
    </main>
  );
}