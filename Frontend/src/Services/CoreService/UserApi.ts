import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse, User } from "../../Types/Common.type.ts";
import type { LoginData, LoginForm, PasswordChangingForm, RegistrationForm } from "../../Types/User.type.ts";

export const registerInstructor = async (registrationForm: RegistrationForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/instructor-registration", registrationForm);
    return response.data;
}

export const registerStudent = async (registrationForm: RegistrationForm): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>("/user-api/public/student-registration", registrationForm);
    return response.data;
}

export const verifyRegisteredEmail = async (email: string, otpCode: string): Promise<ApiResponse<void>> => {
    const response = await axios.post<ApiResponse<void>>(`/user-api/public/verify-registration-email/${email}/${otpCode}`);
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

export const enterEmailToRecoverPassword = async (email: string): Promise<ApiResponse<void>> => {
    const response = await axios.post(`/user-api/public/otp-forgot-password/${email}`);
    return response.data;
}

export const verifyOtpToRecoverPassword = async (email: string, otpCode: string): Promise<ApiResponse<void>> => {
    const response = await axios.post(`/user-api/public/verify-otp-forgot-password/${email}/${otpCode}`, null);
    return response.data;
}

export const recoverPassword = async (email: string, otpCode: string, passwordChangingForm: PasswordChangingForm): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/user-api/public/change-forgotten-password/${email}/${otpCode}`, passwordChangingForm);
    return response.data;
}