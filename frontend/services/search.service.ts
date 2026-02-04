import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/search';

export const searchService = {
    async globalSearch(query: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}?q=${encodeURIComponent(query)}`);
        return data.data;
    }
};
