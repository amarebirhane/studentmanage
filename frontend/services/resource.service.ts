import api from '@/lib/api';

export interface Resource {
    id: string;
    title: string;
    description?: string;
    type: 'PDF' | 'VIDEO' | 'LINK' | 'IMAGE' | 'LIVE_CLASS';
    url: string;
    subjectId?: string;
    classId?: string;
    subject?: {
        name: string;
    };
    uploadedBy: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export interface CreateResourceData {
    title: string;
    description?: string;
    type: string;
    url: string;
    subjectId?: string;
    classId?: string;
}

export const resourceService = {
    getAll: async (params?: any) => {
        const response = await api.get('/resources', { params });
        return response.data.data;
    },

    create: async (data: CreateResourceData) => {
        const response = await api.post('/resources', data);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    },

    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url; // Assuming the upload endpoint returns { url: '...' }
    }
};
