import api from '@/lib/api';
import { Class, Section } from '@/types/class';
import { ApiResponse } from '@/types/api';

export const classService = {
    async getClasses(): Promise<Class[]> {
        const { data } = await api.get<ApiResponse<Class[]>>('/classes');
        return data.data!;
    },

    async getSections(): Promise<Section[]> {
        const { data } = await api.get<ApiResponse<Section[]>>('/classes/sections');
        return data.data!;
    },

    async createClass(classData: { name: string; grade: string }): Promise<Class> {
        const { data } = await api.post<ApiResponse<Class>>('/classes', classData);
        return data.data!;
    },

    async createSection(sectionData: { name: string; classId: string }): Promise<Section> {
        const { data } = await api.post<ApiResponse<Section>>('/classes/sections', sectionData);
        return data.data!;
    },

    async deleteClass(id: string): Promise<void> {
        await api.delete(`/classes/${id}`);
    },

    async deleteSection(id: string): Promise<void> {
        await api.delete(`/classes/sections/${id}`);
    },
};
