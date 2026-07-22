export type UserRole = "ADMIN" | "MEMBER";

export interface UserCategory {
    department?: string;
    position?: string;
    duty?: string;
}

export interface User {
    id: number | string;
    email: string;
    name: string;
    role: UserRole;
    groupId?: number | string | null;
    categories?: UserCategory;
}