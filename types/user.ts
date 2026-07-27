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
    departmentId?: number | null;
    departmentName?: string;
    role: MemberRole;
    status: MemberStatus;
    joinedAt?: string | null;
}

// AuthUser를 아래와 같이 정리하면 로그인/내정보 조회 응답처리가 명확해집니다.
export interface AuthUser {
    user: User;
    memberInfo?: MemberInfo | null;
}