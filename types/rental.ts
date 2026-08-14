import { Equipment } from "@/types/equipment";
import { EquipmentUnit } from "@/types/equipmentUnit";
import { Member } from "@/types/member";

export type RentalStatusType = "REQUESTED" | "REJECTED" | "BORROWED" | "RETURNED" | "CANCELLED";

export interface MyRental {
    id: number;
    memberId: number;
    equipmentId: number;
    equipmentUnitId: number | null;
    quantity: number;
    reason: string | null;
    status: RentalStatusType;
    requestedAt: string;
    approvedBy?: number | null;
    approvedAt?: string | null;
    dueAt?: string | null;
    returnedAt: string | null;
    rejectedReason?: string | null;
    createdAt: string;
    updatedAt?: string;

    equipment: Pick<Equipment, "id" | "name" | "imageUrl" | "category">;
    equipmentUnit?: Pick<EquipmentUnit, "id" | "assetNumber">;
}

export interface OrgRental {
    id: number;
    memberId: number;
    equipmentId: number;
    quantity: number;
    reason: string | null;
    status: RentalStatusType;
    requestedAt: string;
    approvedBy?: number | null;
    approvedAt?: string | null;
    dueAt?: string | null;
    returnedAt?: string | null;
    rejectedReason?: string | null;
    createdAt: string;

    member: Pick<Member, "id" | "departmentId" | "role"> & {
        user: Pick<Member["user"], "name" | "email">;
        department?: {
            id: number;
            name: string;
        } | null;
    };
    equipment: Pick<Equipment, "id" | "name" | "status" | "category" | "imageUrl">;
    equipmentUnit?: Pick<EquipmentUnit, "id" | "assetNumber"> | null;
}
