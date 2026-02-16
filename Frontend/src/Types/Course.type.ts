export type courseStatus = "New" | "Update" | "Complete"

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