import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 6, className }: SkeletonLoaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-secondary/20 rounded-lg animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="flex-1 h-4 bg-secondary/40 rounded"
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: SkeletonLoaderProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 space-y-4 animate-pulse", className)}>
      <div className="h-6 bg-secondary/40 rounded w-1/3" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 bg-secondary/40 rounded w-full" />
        ))}
      </div>
    </div>
  );
}
