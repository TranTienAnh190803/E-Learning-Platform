export type CourseStatus = "New" | "Update" | "Complete"
export type LessonType = "STUDY" | "WORK"

// Data
export interface CourseData {
    id: number,
    title: string,
    description: string,
    status: CourseStatus,
    results: string[],
    imageUrl: string | null,
    instructor: string,
    instructorAvatar: string | null,
    publicCourse: boolean
}

// Form
export interface CourseAddingForm {
    title: string,
    description: string,
    publicCourse: boolean,
    password: string,
    image: File | null,
    results: string[],
    lessonTitle: string,
    lessonType: LessonType,
    content: string,
    videoFile: File | null
}

export interface CourseForm {
    title: string,
    description: string,
    publicCourse: boolean,
    password: string,
    image: File | null,
    results: string[],
}