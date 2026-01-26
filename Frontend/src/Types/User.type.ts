// Request Data
export interface RegistrationForm {
    fullName: string,
    dateOfBirth: Date,
    gender: boolean,
    address: string,
    email: string,
    password: string,
    reEnteredPassword: string
}

export interface LoginForm {
    email: string,
    password: string
}

// Response Data