import type { LessonType } from "./Course.type";

// Form
export interface LessonForm {
    title: string;
    lessonType: LessonType;
    content: string;
    videoFile: File | null;
}

// Data
export interface LessonListData {
    id: number;
    title: string;
    addedDate: Date;
}

export interface LessonData extends LessonListData {
    lessonType: LessonType;
    content: string;
    contentUrl: string;
}