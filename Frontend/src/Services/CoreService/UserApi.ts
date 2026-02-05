import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse, User } from "../../Types/Common.type.ts";
import type { LoginData, LoginForm, PasswordChangingForm, ProfileChangingForm, RegistrationForm, RoleFilter } from "../../Types/User.type.ts";

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

export const getAllUser = async (): Promise<ApiResponse<User[]>> => {
    const response = await axios.get<ApiResponse<User[]>>("/user-api/all-user");
    return response.data;
}

export const disableUser = async (userId: number): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/user-api/disable-account/${userId}`);
    return response.data;
}

export const enableUser = async (userId: number): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/user-api/enable-account/${userId}`);
    return response.data;
}

export const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`/user-api/delete-account/${userId}`);
    return response.data;
}

export const searchUser = async (email: string): Promise<ApiResponse<User[]>> => {
    const response = await axios.get<ApiResponse<User[]>>(`/user-api/search-account/${email}`);
    return response.data;
}

export const filterUser = async (role: RoleFilter): Promise<ApiResponse<User[]>> => {
    const response = await axios.get<ApiResponse<User[]>>(`/user-api/filter-account/${role}`);
    return response.data;
}

export const changePersonalInfo = async (profilChangingForm: ProfileChangingForm): Promise<ApiResponse<void>> => {
    const response = await axios.put("/user-api/change-profile", profilChangingForm);
    return response.data;
}

export const changeAvatar = async (formData: FormData): Promise<ApiResponse<void>> => {
    const response = await axios.post("/user-api/upload-avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
}

export const changeUserPassword = async (passwordForm: PasswordChangingForm, oldPassword: string): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/user-api/change-password/${oldPassword}`, passwordForm);
    return response.data;
}

export const otpChangeEmail = async (newEmail: string): Promise<ApiResponse<void>> => {
    const response = await axios.post(`/user-api/otp-change-email/${newEmail}`);
    return response.data;
}

export const verifyChangeEmail = async (otpCode: string, newEmail: string): Promise<ApiResponse<LoginData>> => {
    const response = await axios.post<ApiResponse<LoginData>>(`/user-api/verify-change-email/${newEmail}/${otpCode}`);
    return response.data;
}

export const deleteUserAccount = async (): Promise<ApiResponse<void>> => {
    const response = await axios.delete("/user-api/delete-user-account");
    return response.data;
}