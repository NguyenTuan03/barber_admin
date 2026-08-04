"use client";

import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  /** Number of rows after filtering. */
  shown: number;
  /** Number of rows before filtering. */
  total: number;
  /** Primary action(s) for the list, e.g. an "Add" button. */
  children?: React.ReactNode;
}

/**
 * Search + result count + primary action, sitting directly above the table it
 * controls. Every list screen uses the same bar so the controls are always in
 * the same place.
 */
export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  shown,
  total,
  children,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-0 border-b border-solid border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
      <div className="flex flex-1 items-center gap-3">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined className="text-slate-400" />}
          allowClear
          aria-label={searchPlaceholder}
          className="max-w-xs"
        />
        <span className="hidden text-sm text-slate-500 sm:inline dark:text-slate-400">
          {search ? `${shown} / ${total} mục` : `${total} mục`}
        </span>
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

/** Case/diacritic-insensitive "does any of these fields contain the query" check. */
export function matchesSearch(query: string, ...fields: (string | number | null | undefined)[]) {
  const needle = normalize(query);
  if (!needle) return true;
  return fields.some((field) => normalize(String(field ?? "")).includes(needle));
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
