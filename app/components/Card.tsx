import { cn } from "~/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-charcoal-800 border border-charcoal-700 rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ShopCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-cream-200 rounded-xl shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {children}
    </div>
  );
}
