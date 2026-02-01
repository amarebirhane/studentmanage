export interface Class {
    id: string;
    name: string;
    grade: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Section {
    id: string;
    name: string;
    classId: string;
    class?: Class;
    teacherId?: string;
    createdAt: string;
    updatedAt: string;
}
