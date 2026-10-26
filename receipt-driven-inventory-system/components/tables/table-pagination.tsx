"use client";

import { useState, type ReactNode } from "react";
import { cn } from "cn";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DISABLED_LINK = "pointer-events-none opacity-50";

/** Page buttons to render, collapsed into ellipses once the list gets long. */
function pageWindow(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

/**
 * Slices `rows` into pages and keeps the current page in range, so deleting
 * the last row of the last page falls back a page instead of showing an
 * empty table.
 */
export function useTablePagination<T>(rows: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), pageCount));
  };

  return {
    page: currentPage,
    pageCount,
    visibleRows: rows.slice(startIndex, startIndex + pageSize),
    firstRow: rows.length === 0 ? 0 : startIndex + 1,
    lastRow: Math.min(startIndex + pageSize, rows.length),
    goToPage,
  };
}

export function TablePagination({
  page,
  pageCount,
  onPageChange,
  summary,
  className,
}: {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Left-hand copy, e.g. “Showing 1–10 of 24 items”. */
  summary: ReactNode;
  className?: string;
}) {
  const totalPages = Math.max(1, pageCount);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const atStart = currentPage === 1;
  const atEnd = currentPage === totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="tabular-nums">{summary}</p>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${Math.max(1, currentPage - 1)}`}
              aria-disabled={atStart}
              className={cn(atStart && DISABLED_LINK)}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>

          {pageWindow(currentPage, totalPages).map((entry, index) =>
            entry === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  href={`?page=${entry}`}
                  isActive={entry === currentPage}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(entry);
                  }}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              aria-disabled={atEnd}
              className={cn(atEnd && DISABLED_LINK)}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
