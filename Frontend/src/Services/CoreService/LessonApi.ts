import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse } from "../../Types/Common.type.ts";
import type { LessonData, LessonForm, LessonListData } from "../../Types/Lesson.type.ts";

export const addLesson = async (lessonForm: LessonForm, courseId: number): Promise<ApiResponse<void>> => {
    const response = await axios.post(`/lesson-api/add-lesson/${courseId}`, lessonForm, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const getAllLesson = async (courseId: number): Promise<ApiResponse<LessonListData[]>> => {
    const response = await axios.get<ApiResponse<LessonListData[]>>(`/lesson-api/public/get-all/${courseId}`);
    return response.data;
}

export const getLesson = async (lessonId: number): Promise<ApiResponse<LessonData>> => {
    const response = await axios.get<ApiResponse<LessonData>>(`/lesson-api/get-lesson/${lessonId}`);
    return response.data;
}

export const updateLesson = async (lessonForm: LessonForm, lessonId: number): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/lesson-api/update-lesson/${lessonId}`, lessonForm, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const deleteLesson = async (lessonId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`/lesson-api/delete-lesson/${lessonId}`);
    return response.data;
} 