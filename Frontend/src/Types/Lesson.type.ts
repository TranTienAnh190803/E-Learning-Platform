import type { LessonType } from "./Course.type";

// Form
export interface LessonForm {
    title: string;
    lessonType: LessonType;
    content: string;
    videoFile: File;
}

// Data
export interface LessonListData {
    id: number;
    title: string;
    addedDate: Date;
}

export interface LessonData extends LessonListData {
    lessonType: string;
    content: string;
    contentUrl: string;
}