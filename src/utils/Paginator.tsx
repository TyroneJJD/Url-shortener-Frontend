'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginatorProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisible?: number;
}

export function Paginator({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    maxVisible = 5 
}: PaginatorProps) {
    // No mostrar paginación si solo hay una página
    if (totalPages <= 1) {
        return null;
    }

    // Generar números de página para mostrar
    const generatePageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Mostrar con elipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="mt-6 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>

                    {generatePageNumbers().map((pageNum, index) => (
                        <PaginationItem key={index}>
                            {pageNum === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(pageNum as number)}
                                    isActive={pageNum === currentPage}
                                    className="cursor-pointer"
                                >
                                    {pageNum}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
