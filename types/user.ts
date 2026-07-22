export type UserRole = "USER" | "ADMIN";

export type MemberRole = "OWNER" | "MANAGER" | "MEMBER";

export type MemberStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    createdAt?: string; // 백엔드에서 ISO 날짜 문자열로 넘어옴
    updatedAt?: string;
}

export interface MemberInfo {
    id: number;              // 백엔드 Member 모델의 PK (또는 memberId)
    organizationId: number;
    organizationName?: string;
    departmentId?: number | null;
    departmentName?: string;
    role: MemberRole;
    status: MemberStatus;
    joinedAt?: string | null;
}

export interface AuthUser {
    user: User;
    memberInfo?: MemberInfo | null;
}

// 백엔드 로그인 API 응답 전체 타입 (토큰 포함)
export interface LoginResponse {
    message: string;
    data: {
        user: User;
        token: string;
    };
}