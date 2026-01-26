import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse } from "../../Types/Common.type.ts";
import type { LoginForm, RegistrationForm } from "../../Types/User.type.ts";

const registerInstructor = async (registrationForm: RegistrationForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/instructor-registration", registrationForm);
    return response.data;
}

const registerStudent = async (registrationForm: RegistrationForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/student-registration", registrationForm);
    return response.data;
}

const login = async (loginForm: LoginForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/login", loginForm);
    return response.data;
}