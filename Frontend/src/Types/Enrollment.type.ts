import type { CourseData } from "./Course.type";

export interface EnrollmentData extends CourseData {
    enrollAt: Date;
    completedStatus: number;
}