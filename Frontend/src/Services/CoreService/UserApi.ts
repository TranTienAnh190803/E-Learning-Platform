import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse, User } from "../../Types/Common.type.ts";
import type { LoginData, LoginForm, RegistrationForm } from "../../Types/User.type.ts";

export const registerInstructor = async (registrationForm: RegistrationForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/instructor-registration", registrationForm);
    return response.data;
}

export const registerStudent = async (registrationForm: RegistrationForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/student-registration", registrationForm);
    return response.data;
}

export const login = async (loginForm: LoginForm): Promise<ApiResponse<LoginData>> => {
    const response = await axios.post<ApiResponse<LoginData>>("/user-api/public/login", loginForm);
    return response.data;
}

export const getProfile = async (): Promise<ApiResponse<User>> => {
    const response = await axios.get<ApiResponse<User>>("/user-api/profile");
    return response.data;
}