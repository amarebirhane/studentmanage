import { useState, useMemo } from 'react';

interface UsePaginationOptions {
    initialPage?: number;
    initialLimit?: number;
}

export const usePagination = ({ initialPage = 1, initialLimit = 10 }: UsePaginationOptions = {}) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [total, setTotal] = useState(0);

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    const hasNext = useMemo(() => page < totalPages, [page, totalPages]);
    const hasPrev = useMemo(() => page > 1, [page]);

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const nextPage = () => {
        if (hasNext) {
            setPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (hasPrev) {
            setPage((prev) => prev - 1);
        }
    };

    const reset = () => {
        setPage(1);
    };

    return {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        setPage: goToPage,
        setLimit,
        setTotal,
        nextPage,
        prevPage,
        reset,
    };
};
