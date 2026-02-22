import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse } from "../../Types/Common.type";
import type { EnrollmentData } from "../../Types/Enrollment.type.ts";

export const getEnrolledCourse = async (): Promise<ApiResponse<EnrollmentData[]>> => {
    const response = await axios.get<ApiResponse<EnrollmentData[]>>("/enrollment-api/get-enrolled-courses");
    return response.data;
}

export const getEnrolledCourseId = async (): Promise<ApiResponse<number[]>> => {
    const response = await axios.get<ApiResponse<number[]>>("/enrollment-api/get-courses-for-socket");
    return response.data;
}