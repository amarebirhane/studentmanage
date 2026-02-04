import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { ExpenseService } from './expense.service';
import { ApiResponse } from '../../utils/apiResponse';

export class ExpenseController {
    static async create(req: AuthenticatedRequest, res: Response) {
        try {
            const expense = await ExpenseService.createExpense({
                ...req.body,
                recordedById: req.user!.id,
                schoolId: req.user!.schoolId!
            });
            return ApiResponse.success(res, expense, 'Expense created successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    static async getAll(req: AuthenticatedRequest, res: Response) {
        try {
            const expenses = await ExpenseService.getExpenses(req.user!.schoolId!, req.query);
            return ApiResponse.success(res, expenses, 'Expenses fetched successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    static async update(req: AuthenticatedRequest, res: Response) {
        try {
            const expense = await ExpenseService.updateExpense(req.params.id as string, req.body);
            return ApiResponse.success(res, expense, 'Expense updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response) {
        try {
            await ExpenseService.deleteExpense(req.params.id as string);
            return ApiResponse.success(res, null, 'Expense deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }

    static async getSummary(req: AuthenticatedRequest, res: Response) {
        try {
            const summary = await ExpenseService.getSummary(req.user!.schoolId!);
            return ApiResponse.success(res, summary, 'Expense summary fetched');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
