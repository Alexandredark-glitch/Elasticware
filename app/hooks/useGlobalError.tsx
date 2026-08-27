import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";

type ErrorContextValue = {
  error: string | null;
  setError: (msg: unknown) => void;
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextValue | null>(null);

function toUserMessage(err: unknown): string | null {
  if (!err) return null;
  if (typeof err === "string" && err.trim() === "") return null;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An error occurred. Please try again later.";
}

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setError = useCallback((msg: unknown) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const text = toUserMessage(msg);
    if (!text) {
      setErrorState(null);
      return;
    }
    setErrorState(text);
    timeoutRef.current = setTimeout(() => setErrorState(null), 5000);
  }, []);

  const clearError = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setErrorState(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useGlobalError(): ErrorContextValue {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useGlobalError must be used inside ErrorProvider");
  return ctx;
}