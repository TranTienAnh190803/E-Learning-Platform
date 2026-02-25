import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse } from "../../Types/Common.type";
import type { CourseData, CourseMemberData } from "../../Types/Course.type.ts";

export const getOwnedCourse = async (): Promise<ApiResponse<CourseData[]>> => {
    const response = await axios.get<ApiResponse<CourseData[]>>("/course-api/get-all-owned-courses");
    return response.data;
}

export const getAllCourse = async (): Promise<ApiResponse<CourseData[]>> => {
    const response = await axios.get<ApiResponse<CourseData[]>>("/course-api/public/get-all");
    return response.data;
}

export const getOneCourse = async (courseId: number): Promise<ApiResponse<CourseData>> => {
    const response = await axios.get<ApiResponse<CourseData>>(`/course-api/public/get-course/${courseId}`);
    return response.data;
}

export const addCourse = async (courseForm: FormData): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/course-api/add-course", courseForm, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const updateCourse = async (courseId: number, courseForm: FormData): Promise<ApiResponse<void>> => {
    const response = await axios.patch<ApiResponse<void>>(`/course-api/update-course/${courseId}`, courseForm, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const deleteCourse = async (courseId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`/course-apidelete-course/${courseId}`);
    return response.data;
}

export const getOwnedCourseId = async (): Promise<ApiResponse<number[]>> => {
    const response = await axios.get<ApiResponse<number[]>>("/course-api/get-owned-courses");
    return response.data;
}

export const completeUpdateCourse = async (courseId: number): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/course-api/complete-update-course/${courseId}`);
    return response.data;
}

export const getCourseMemeber = async (courseId: number): Promise<ApiResponse<CourseMemberData[]>> => {
    const response = await axios.get<ApiResponse<CourseMemberData[]>>(`/course-api/get-member/${courseId}`);
    return response.data;
}

export const kickMember = async (courseId: number, studentId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`/course-api/kick-member/${courseId}/${studentId}`);
    return response.data;
}