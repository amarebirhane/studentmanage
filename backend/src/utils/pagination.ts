export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

export const getPagination = (options: PaginationOptions) => {
    const page = Math.abs(options.page || 1);
    const limit = Math.abs(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
