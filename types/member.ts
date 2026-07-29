import { User } from "@/types/user";

export const MemberRole = {
    OWNER: "OWNER",
    MANAGER: "MANAGER",
    MEMBER: "MEMBER",
};

export type MemberRoleType = (typeof MemberRole)[keyof typeof MemberRole];

export const MemberStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    WITHDRAWN: "WITHDRAWN",
}

export type MemberStatusType = (typeof MemberStatus)[keyof typeof MemberStatus];

export interface Member {
    id: number;
    organizationId: number;
    userId: number;
    departmentId?: number;
    role: MemberRoleType;
    status: MemberStatusType;
    approvedBy?: number;
    approvedAt?: string;
    rejectedReason?: string;
    joinedAt?: string;
    createdAt: string;
    updatedAt?: string;
    user: Pick<User, "id" | "name" | "email">
}