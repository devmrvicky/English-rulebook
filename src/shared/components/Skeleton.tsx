export function SkeletonLine({ width = "100%" }: { width?: string }) {
  return <div className="skeleton h-4" style={{ width }} />;
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-lg border border-ink/10 p-4 dark:border-paper/10">
      <div className="skeleton h-5 w-1/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
    </div>
  );
}
