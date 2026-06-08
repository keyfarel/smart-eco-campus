import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface LogPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  currentCount: number
  onPageChange: (page: number) => void
}

export function LogPagination({
  currentPage,
  totalPages,
  totalCount,
  currentCount,
  onPageChange,
}: LogPaginationProps) {
  
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  const pages = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-zinc-500 font-mono">
        Showing {currentCount} of {totalCount} logs
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={`cursor-pointer h-7 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
            />
          </PaginationItem>
          
          {pages.map((page, index) => {
            return (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis className="text-zinc-500 w-6 sm:w-9" />
                ) : (
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page as number)}
                    className={`cursor-pointer w-7 h-7 sm:w-9 sm:h-9 text-[10px] sm:text-sm ${page === currentPage ? "bg-zinc-800 text-zinc-200 border border-zinc-700" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent"}`}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className={`cursor-pointer h-7 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-sm ${currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
