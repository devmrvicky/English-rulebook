import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import { Sidebar } from "@/shared/components/Sidebar";
import { TopBar } from "@/shared/components/TopBar";

function getInitialTheme(): boolean {
  const stored = localStorage.getItem("erb-theme");
  if (stored) return stored === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("erb-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink dark:bg-nightpaper dark:text-paper">
      <TopBar onMenuClick={() => setDrawerOpen(true)} isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-ink/10 dark:border-paper/10 md:block">
          <Sidebar />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawerOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-paper shadow-xl dark:bg-nightpaper">
              <div className="flex items-center justify-between px-3 py-3">
                <span className="font-display text-sm font-semibold">Contents</span>
                <button onClick={() => setDrawerOpen(false)} className="rounded-md p-1.5 hover:bg-ink/5" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
