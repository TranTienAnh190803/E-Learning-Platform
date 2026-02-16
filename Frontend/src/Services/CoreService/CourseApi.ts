import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse } from "../../Types/Common.type";
import type { CourseData } from "../../Types/Course.type.ts";

export const getOwnedCourse = async (): Promise<ApiResponse<CourseData[]>> => {
    const response = await axios.get<ApiResponse<CourseData[]>>("/course-api/get-all-owned-courses");
    return response.data;
}