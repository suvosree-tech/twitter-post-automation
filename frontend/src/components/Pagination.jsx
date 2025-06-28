/**
 * @param {Object} props
 * @param {import('../types/index.js').PaginationState} props.pagination
 * @param {function(number): void} props.onPageChange
 */

export default function Pagination(props) {
  const getPageNumbers = () => {
    const { currentPage, totalPages } = props.pagination;
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= props.pagination.totalPages) {
      props.onPageChange(page);
    }
  };

  return (
    <div class="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => handlePageChange(props.pagination.currentPage - 1)}
        disabled={props.pagination.currentPage === 1}
        class="px-3 py-2 glass rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((page) => (
        <button
          onClick={() => handlePageChange(page)}
          class={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            page === props.pagination.currentPage
              ? 'bg-primary-500 text-white shadow-lg transform scale-105'
              : 'glass text-white hover:bg-white/20'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(props.pagination.currentPage + 1)}
        disabled={props.pagination.currentPage === props.pagination.totalPages}
        class="px-3 py-2 glass rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}