import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onPageChange(idx + 1)}
          aria-label={`انتقل إلى الصفحة ${idx + 1}`}
          className={`w-3 h-3 rounded-full transition-all duration-200 border-2 focus:outline-none
            ${currentPage === idx + 1 ? 'bg-primary border-primary scale-125' : 'bg-gray-300 border-gray-300 hover:bg-primary/40'}`}
        />
      ))}
    </div>
  )
} 