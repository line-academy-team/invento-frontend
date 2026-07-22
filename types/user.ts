
export type UserRole = "USER" | "ADMIN";

export type MemberRole = "OWNER" | "MANAGER" | "MEMBER";

export type MemberStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
}

export interface MemberInfo {
    memberId: number;
    organizationId: number;
    organizationName?: string;
    departmentId?: number | null;
    departmentName?: string;
    role: MemberRole;
    status: MemberStatus;
}

export interface AuthUser {
    user: User;
    memberInfo?: MemberInfo | null;
}