export type UserRole = "USER" | "ADMIN";

export type MemberRole = "OWNER" | "MANAGER" | "MEMBER";

export type MemberStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

export interface MemberInfo {
    id: number;
    organizationId: number;
    organizationName?: string;

    departmentId: number | null;
    departmentName?: string;

    role: MemberRole;
    status: MemberStatus;
    joinedAt: string | null;
}

export interface AuthUser {
    user: User;
    memberInfo: MemberInfo | null;
}

export interface GetMeResponse {
    message: string;
    data: AuthUser;
}

export interface LoginResponse {
    message: string;
    data: AuthUser & {
        token: string;
    };
}
