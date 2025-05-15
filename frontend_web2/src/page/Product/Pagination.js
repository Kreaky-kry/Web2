import React from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({ currentPage, onPageChange }) => {
    const totalPages = 10;
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage <= totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleFirstPage = () => {
        onPageChange(1);
    };

    const handlePageChange = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li
                    key={i}
                    className={`page-item ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}>
                    <Link className="page-link" href="#">
                        {i}
                    </Link>
                </li>
            );
        }

        return pageNumbers;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li
                    className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handleFirstPage}>
                    <Link className="page-link" href="#">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-chevron-double-left"
                            viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            <path
                                fillRule="evenodd"
                                d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                        </svg>
                    </Link>
                </li>
                <li
                    className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevPage}>
                    <Link className="page-link" href="#">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-chevron-compact-left"
                            viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223" />
                        </svg>
                    </Link>
                </li>
                {renderPageNumbers()}
                <li
                    className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={handleNextPage}>
                    <Link className="page-link" href="#">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-chevron-compact-right"
                            viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
                        </svg>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;