import { Response } from 'express';
import { SearchService } from './search.service';
import { ApiResponse } from '../../utils/apiResponse';

export class SearchController {
    /**
     * Global search
     */
    static async search(req: any, res: Response) {
        try {
            const { q } = req.query;
            const { schoolId } = req.user;

            if (!q) {
                return ApiResponse.success(res, { students: [], teachers: [], classes: [] }, 'Empty search query');
            }

            const results = await SearchService.globalSearch(q as string, schoolId);
            return ApiResponse.success(res, results, 'Search results retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
