import * as Sentry from "@sentry/node";

if (typeof window === "undefined" && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

export { Sentry };