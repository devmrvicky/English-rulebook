import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Moon, Sun, BookMarked } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function TopBar({ onMenuClick, isDark, onToggleTheme }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur dark:border-paper/10 dark:bg-nightpaper/90">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-ink-soft hover:bg-ink/5 md:hidden"
        aria-label="Open contents"
      >
        <Menu size={20} />
      </button>

      <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink dark:text-paper">
        <BookMarked size={18} className="text-amber" />
        English Rule Book
      </Link>

      <button
        onClick={() => navigate("/search")}
        className="ml-auto flex items-center gap-2 rounded-full border border-ink/15 bg-paper-dim px-3 py-1.5 text-sm text-ink-faint hover:border-ink/30 dark:border-paper/15 dark:bg-nightpaper"
        aria-label="Search rules"
      >
        <Search size={15} />
        <span className="hidden sm:inline">Search rules…</span>
      </button>

      <button
        onClick={onToggleTheme}
        className="rounded-md p-1.5 text-ink-soft hover:bg-ink/5 dark:text-paper/80 dark:hover:bg-paper/10"
        aria-label="Toggle reading theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
