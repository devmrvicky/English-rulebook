import { Link } from "react-router-dom";
import { BookX } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <BookX size={40} className="mb-4 text-ink-faint" strokeWidth={1.5} />
      <h1 className="font-display text-2xl font-bold text-ink dark:text-paper">Page not found</h1>
      <p className="mt-2 text-sm text-ink-faint">This page doesn't exist in the Rule Book.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper dark:bg-paper dark:text-nightpaper"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
