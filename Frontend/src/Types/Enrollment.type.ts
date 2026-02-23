import type { CourseData } from "./Course.type";

export interface EnrollmentData extends CourseData {
    enrollAt: Date;
    completedStatus: number;
}

export interface ProcessTracking {
    id: number | null;
    title: string;
    imageUrl: string | null;
    enrollAt: Date | null;
    completedStatus: number;
}