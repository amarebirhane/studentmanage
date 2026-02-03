import api from '@/lib/api';

export const reportService = {
    async downloadAttendanceReport(params: {
        classId?: string;
        sectionId?: string;
        dateFrom: string;
        dateTo: string;
    }) {
        const response = await api.get('/reports/attendance', {
            params,
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'attendance-report.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    async downloadExamReport(examId: string) {
        const response = await api.get(`/reports/exams/${examId}`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exam-results.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
