import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/shared/components/AppLayout";
import { DashboardPage } from "@/features/english/pages/DashboardPage";
import { CategoryPage } from "@/features/english/pages/CategoryPage";
import { RulePage } from "@/features/english/pages/RulePage";
import { SearchPage } from "@/features/english/pages/SearchPage";
import { BookmarksPage } from "@/features/english/pages/BookmarksPage";
import { NotFoundPage } from "@/features/english/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "bookmarks", element: <BookmarksPage /> },

      /**
       * Category → chapter accordion view
       * /category/:categorySlug
       */
      { path: "category/:categorySlug", element: <CategoryPage /> },

      /**
       * Rule reading view.
       * chapterSlug is "-" when navigating from search (no chapter context).
       * /category/:categorySlug/:chapterSlug/:ruleSlug
       */
      { path: "category/:categorySlug/:chapterSlug/:ruleSlug", element: <RulePage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
