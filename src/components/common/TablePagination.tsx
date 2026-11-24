import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ShowEntriesSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  labelPrefix?: string;
  labelSuffix?: string;
}

export const ShowEntriesSelector: React.FC<ShowEntriesSelectorProps> = ({
  pageSize,
  onPageSizeChange,
  options = [5, 10, 25, 50],
  labelPrefix = 'Tampilkan',
  labelSuffix = 'data',
}) => {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
      {labelPrefix && <span>{labelPrefix}</span>}
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1351b8] font-semibold transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {labelSuffix && <span>{labelSuffix}</span>}
    </div>
  );
};

export interface TablePaginationProps {
  currentPage: number;
  totalEntries: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showEntriesSelector?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalEntries,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  showEntriesSelector = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white">
      {/* Left: Info Text & Optional Inline Entries */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {showEntriesSelector && onPageSizeChange && (
          <>
            <ShowEntriesSelector
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              options={pageSizeOptions}
            />
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
          </>
        )}
        <p className="font-medium">
          Menampilkan{' '}
          <span className="font-semibold text-slate-700">{startEntry}</span> sampai{' '}
          <span className="font-semibold text-slate-700">{endEntry}</span> dari{' '}
          <span className="font-semibold text-slate-800">{totalEntries}</span> data
        </p>
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            currentPage === 1
              ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-slate-400 font-bold select-none"
                >
                  &hellip;
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-[#1351b8] text-white font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-medium'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalEntries === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            currentPage === totalPages || totalEntries === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
          aria-label="Halaman Selanjutnya"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
