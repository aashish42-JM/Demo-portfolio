"use client";

import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

/** Root layout container — fills window body, enables internal flex scrolling */
export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div className={`app-shell h-full flex flex-col min-h-0 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

interface AppScrollProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

/** Scrollable content area with consistent spacing */
export function AppScroll({ children, className = "", noPadding = false }: AppScrollProps) {
  return (
    <div
      className={`app-scroll window-body flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${className}`}
    >
      <div className={noPadding ? "h-full" : "app-content-padding app-content-inner"}>
        {children}
      </div>
    </div>
  );
}

interface AppFooterProps {
  children: ReactNode;
  className?: string;
}

/** Fixed footer area (input bars, toolbars) */
export function AppFooter({ children, className = "" }: AppFooterProps) {
  return (
    <div className={`app-footer shrink-0 border-t border-[rgba(79,195,247,0.15)] ${className}`}>
      {children}
    </div>
  );
}

interface AppHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/** Consistent page header with title + description */
export function AppPageHeader({ title, description, icon, action }: AppHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-5 mb-2">
      <div className="flex items-center gap-4 min-w-0">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0">
          <h1 className="app-section-title text-3xl font-bold text-white">{title}</h1>
          {description && (
            <p className="app-section-desc font-mono text-sm text-[#64b5f6]/70 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
