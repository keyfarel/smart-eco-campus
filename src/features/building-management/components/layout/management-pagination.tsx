"use client";

import { Button } from "@/components/ui/button";

interface ManagementPaginationProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ManagementPagination({
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
}: ManagementPaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 p-4 border-t border-zinc-800">
      <span className="text-xs text-zinc-500 font-mono">
        Showing <span className="font-semibold text-zinc-300">{startIndex + 1}</span> to{" "}
        <span className="font-semibold text-zinc-300">{endIndex}</span> of{" "}
        <span className="font-semibold text-zinc-300">{totalItems}</span> entries
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="bg-zinc-950 border-zinc-855 hover:bg-zinc-900 text-zinc-300 text-xs h-8 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono px-2">
          Page <span className="text-zinc-200 font-bold ml-1">{currentPage}</span> of{" "}
          <span className="text-zinc-200 font-bold">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-zinc-955 border-zinc-855 hover:bg-zinc-900 text-zinc-300 text-xs h-8 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
