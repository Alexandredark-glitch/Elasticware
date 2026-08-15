import { cn } from "~/lib/utils";

type BadgeVariant = "bot_handling" | "open" | "resolved";

const variantStyles: Record<BadgeVariant, string> = {
  bot_handling:
    "bg-teal-500/15 text-teal-300 border-teal-500/30",
  open: "bg-accent-500/15 text-accent-300 border-accent-500/30",
  resolved:
    "bg-charcoal-500/20 text-charcoal-300 border-charcoal-500/30",
};

const variantDot: Record<BadgeVariant, string> = {
  bot_handling: "bg-teal-400",
  open: "bg-accent-400",
  resolved: "bg-charcoal-400",
};

const variantLabel: Record<BadgeVariant, string> = {
  bot_handling: "Bot Handling",
  open: "Open",
  resolved: "Resolved",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        variantStyles[status],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", variantDot[status])} />
      {variantLabel[status]}
    </span>
  );
}
