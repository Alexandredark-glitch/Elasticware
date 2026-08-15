import { cn } from "~/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "disabled";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<Exclude<ButtonVariant, "disabled">, string> = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700",
  secondary:
    "bg-charcoal-700 text-cream-100 hover:bg-charcoal-600 border border-charcoal-600",
  ghost:
    "bg-transparent text-cream-100 hover:bg-charcoal-700/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  if (disabled || variant === "disabled") {
    return (
      <button
        disabled
        className={cn(
          "px-5 py-2.5 text-sm rounded-lg bg-charcoal-700 text-charcoal-400 cursor-not-allowed border border-charcoal-600",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-ring",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
