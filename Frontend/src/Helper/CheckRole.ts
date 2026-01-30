type Roles = "ADMIN" | "INSTRUCTOR" | "STUDENT"

export const isAdmin = (role: string): boolean => {
    return role as Roles === "ADMIN";
}

export const isInstructor = (role: string): boolean => {
    return role as Roles === "INSTRUCTOR";
}

export const isStudent = (role: string): boolean => {
    return role as Roles === "STUDENT";
}