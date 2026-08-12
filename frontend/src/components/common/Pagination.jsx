import "./Pagination.css";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-left">
        <span className="pagination-text">Rows per page:</span>
        <select className="pagination-select" disabled>
          <option>{itemsPerPage}</option>
        </select>
      </div>

      <div className="pagination-right">
        <span className="pagination-text">
          {totalItems === 0 ? "0-0 of 0" : `${startItem}-${endItem} of ${totalItems}`}
        </span>
        <div className="pagination-arrows">
          <button 
            className="pagination-btn" 
            onClick={handlePrev} 
            disabled={currentPage === 1 || totalItems === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="pagination-btn" 
            onClick={handleNext} 
            disabled={currentPage === totalPages || totalItems === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
