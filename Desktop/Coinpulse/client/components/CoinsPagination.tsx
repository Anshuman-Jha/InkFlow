"use client";
import { PaginationProps } from '@/app/type';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { Ellipsis } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export const CoinsPagination = ({ currentPage, totalPages, hasMorePages }: PaginationProps) => {

    const router = useRouter();

    const handlePageChange = (page: Number) => {
        router.push(`/coins?page=${page}`);
    };

    const pageNumbers = buildPageNumbers(currentPage, totalPages);
    const isLastPage = !hasMorePages || currentPage === totalPages;

    return (
        <Pagination id='coins-pagination'>
            <PaginationContent className='pagination-content'>
                <PaginationItem className='pagination-control prev'>
                    <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'control-disabled' : 'control-button'}
                    />
                </PaginationItem>

                <div className='pagination-pages'>
                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>

                            {page === Ellipsis ? (<span className='ellipsis'> ... </span>) : (
                                <PaginationLink onClick={() => handlePageChange(page)}
                                    className={cn('page-link', {
                                        'page-link-active': currentPage === page,
                                    })}>
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                </div>

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem className='pagination-control next'>
                    <PaginationNext className={isLastPage ? 'control-disabled' : 'control-button'}
                        onClick={() => !isLastPage && handlePageChange(currentPage + 1)} />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    );
};