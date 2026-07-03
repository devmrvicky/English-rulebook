import { NavLink } from "react-router-dom";
import {
  LayoutGrid, Search, Bookmark, Tag, UserRound, Zap, Link2, Clock,
  GitCompare, ArrowLeftRight, type LucideIcon,
} from "lucide-react";
import { useCatalogStore } from "@/features/english/store/catalogStore";
import { cn } from "@/shared/utils/cn";

// Icon registry: only the icons actually used by seeded categories ship.
// To add a new category icon, import it above and register it here.
const ICON_MAP: Record<string, LucideIcon> = {
  Tag, UserRound, Zap, Link2, Clock, GitCompare, ArrowLeftRight,
  Search: Search as LucideIcon,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Tag;
}

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const categories = useCatalogStore((s) => s.categories);
  const status = useCatalogStore((s) => s.status);

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto scrollbar-thin px-3 py-4">
      <div className="mb-2 px-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Contents</p>
      </div>

      <SidebarLink to="/" Icon={LayoutGrid} label="Dashboard" onNavigate={onNavigate} end />
      <SidebarLink to="/search" Icon={Search as LucideIcon} label="Search" onNavigate={onNavigate} />
      <SidebarLink to="/bookmarks" Icon={Bookmark} label="Bookmarks" onNavigate={onNavigate} />

      <div className="mt-4 mb-1 px-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Categories</p>
      </div>

      {status === "loading" && (
        <div className="space-y-2 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-8 w-full" />
          ))}
        </div>
      )}

      {categories.map((cat) => {
        const Icon = resolveIcon(cat.icon);
        const pct = cat.ruleCount > 0 ? Math.round((cat.completedCount / cat.ruleCount) * 100) : 0;
        return (
          <SidebarLink
            key={cat.id}
            to={`/category/${cat.slug}`}
            Icon={Icon}
            label={cat.name}
            onNavigate={onNavigate}
            trailing={
              <span className="font-mono text-[10px] text-ink-faint">{pct > 0 ? `${pct}%` : cat.ruleCount}</span>
            }
          />
        );
      })}
    </nav>
  );
}

function SidebarLink({
  to, Icon, label, onNavigate, end, trailing,
}: {
  to: string;
  Icon: LucideIcon;
  label: string;
  onNavigate?: () => void;
  end?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
          isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
        )
      }
    >
      <Icon size={16} strokeWidth={2} className="shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {trailing}
    </NavLink>
  );
}
