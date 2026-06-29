import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </span>
            <span className="font-semibold text-sm tracking-tight">
              Wobb Discover
            </span>
          </Link>
          {title && (
            <h1 className="text-sm font-medium text-gray-500 truncate max-w-xs">
              {title}
            </h1>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
