export type courseStatus = "New" | "Update" | "Complete"
export type LessonType = "STUDY" | "WORK"

// Data
export interface CourseData {
    id: number,
    title: string,
    description: string,
    status: courseStatus,
    results: string[],
    imageUrl: string,
    instructor: string,
    instructorAvatar: string | null,
    public: boolean
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