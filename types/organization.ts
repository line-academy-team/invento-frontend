import { User } from "@/types/user";

export interface Organization {
    id: number;
    name: string;
    description?: string;
    logoUrl?: string;
    inviteCode: string;
    createdBy: number;
    creator: Pick<User, "id" | "name" | "email">;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}