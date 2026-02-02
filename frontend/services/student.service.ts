import api from '@/lib/api';
import { StudentProfile, StudentFormData } from '@/types/student';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const studentService = {
    async getStudents(params?: PaginationParams): Promise<PaginatedResponse<StudentProfile>> {
        const { data } = await api.get<ApiResponse<any>>('/students', { params });
        return {
            data: data.data.students,
            pagination: data.data.pagination
        };
    },

    async getStudentById(id: string): Promise<StudentProfile> {
        const { data } = await api.get<ApiResponse<StudentProfile>>(`/students/${id}`);
        return data.data!;
    },

    async createStudent(studentData: StudentFormData): Promise<StudentProfile> {
        const { data } = await api.post<ApiResponse<StudentProfile>>('/students', studentData);
        return data.data!;
    },

    async updateStudent(id: string, studentData: Partial<StudentFormData>): Promise<StudentProfile> {
        const { data } = await api.put<ApiResponse<StudentProfile>>(`/students/${id}`, studentData);
        return data.data!;
    },

    async deleteStudent(id: string): Promise<void> {
        await api.delete(`/students/${id}`);
    },
};
