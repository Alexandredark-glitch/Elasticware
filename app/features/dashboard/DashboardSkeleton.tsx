import { Skeleton } from "~/components/Skeleton";

export function TicketQueueSkeleton() {
  return (
    <div className="p-3 space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700/50 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex justify-between items-center pt-2 border-t border-charcoal-700/40">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TicketDetailSkeleton() {
  return (
    <div className="flex flex-col h-full bg-charcoal-900">
      {/* Header Skeleton */}
      <div className="px-5 py-4 border-b border-charcoal-700 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-3" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="h-6 w-2/3" />
      </div>

      {/* Message Bubbles Skeleton */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Customer bubble */}
        <div className="flex flex-col items-start space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-14 w-2/3 rounded-2xl rounded-bl-md" />
        </div>
        {/* Bot bubble */}
        <div className="flex flex-col items-end space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-20 w-3/4 rounded-2xl rounded-br-md" />
        </div>
        {/* Customer bubble */}
        <div className="flex flex-col items-start space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-12 w-1/2 rounded-2xl rounded-bl-md" />
        </div>
        {/* Agent bubble */}
        <div className="flex flex-col items-end space-y-1.5">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-16 w-3/5 rounded-2xl rounded-br-md" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-charcoal-900">
      <aside className="w-full sm:w-80 lg:w-96 border-r border-charcoal-700 flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-700">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <TicketQueueSkeleton />
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <TicketDetailSkeleton />
      </main>
    </div>
  );
}
