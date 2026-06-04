import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-zinc-500 font-mono">
        Showing {currentCount} of {totalCount} logs
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-200 px-3 py-1 bg-zinc-800 rounded-md">
            {currentPage}
          </span>
          <span className="text-sm text-zinc-500">of {totalPages || 1}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
