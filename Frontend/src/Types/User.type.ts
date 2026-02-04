// Request Form
export interface RegistrationForm {
    fullName: string,
    dateOfBirth?: Date,
    gender?: boolean,
    address: string,
    email: string,
    password: string,
    reEnteredPassword: string
}

export interface LoginForm {
    email: string,
    password: string
}

export interface VerifyEmailForm {
    email: string,
    otpCode: string
}

export interface PasswordChangingForm {
    newPassword: string,
    reEnteredPassword: string
}

export interface PasswordRecoveryNote {
    email: string,
    otpCode: string
}

export type RoleFilter = "ALL" | "INSTRUCTOR" | "STUDENT"

export interface ProfileChangingForm {
    fullName: string,
    gender: boolean,
    dateOfBirth: Date,
    address: string
}

// Response Data
export interface LoginData {
    token: string,
    role: string
}