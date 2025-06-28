import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { generatePageNumbers } from '../utils/helpers';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    totalCount, 
    limit, 
    onPageChange,
    className = '' 
}) => {
    if (totalPages <= 1) return null;

    const pageNumbers = generatePageNumbers(currentPage, totalPages, 5);
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalCount);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const showFirstPage = pageNumbers[0] > 1;
    const showLastPage = pageNumbers[pageNumbers.length - 1] < totalPages;
    const showFirstEllipsis = pageNumbers[0] > 2;
    const showLastEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Results Info */}
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* First Page */}
                {showFirstPage && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className="w-10"
                        >
                            1
                        </Button>
                        {showFirstEllipsis && (
                            <div className="flex items-center justify-center w-10 h-8">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                    </>
                )}

                {/* Page Numbers */}
                {pageNumbers.map(page => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                    >
                        {page}
                    </Button>
                ))}

                {/* Last Page */}
                {showLastPage && (
                    <>
                        {showLastEllipsis && (
                            <div className="flex items-center justify-center w-10 h-8">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="w-10"
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;

