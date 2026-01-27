// Common Response
export interface ApiResponse<T> {
    success: boolean,
    statusCode: number,
    message?: string,
    data?: T
}

// AuthState
export interface User {
    id: number,
    fullName: string,
    gender: boolean,
    dateOfBirth: Date,
    address: string,
    role: string,
    email: string,
    status: string,
    statusNumber: number
}

export type AuthState =
    | {status: "guest"}
    | {status: "loading"}
    | {status: "authenticated", user: User}