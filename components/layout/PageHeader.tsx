"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * Plain title block for the top of a section. Deliberately not a Card — the
 * page already sits on a card-based body, and wrapping the title in another
 * bordered box just adds a frame with no information in it.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {description && (
          <p className="m-0 mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
