import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink/15 px-6 py-16 text-center dark:border-paper/15">
      <Icon size={28} className="mb-3 text-ink-faint" strokeWidth={1.5} />
      <p className="font-display text-base font-semibold text-ink dark:text-paper">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-faint">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
