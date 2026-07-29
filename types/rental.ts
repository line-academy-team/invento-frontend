import { Equipment } from "@/types/equipment";
import { EquipmentUnit } from "@/types/equipmentUnit";
import { Member } from "@/types/member";

export type RentalStatusType = "REQUESTED" | "BORROWED" | "LOST" | "BROKEN" | "DISPOSED";

export interface MyRental {
    id: number;
    memberId: number;
    equipmentId: number;
    equipmentUnitId: number| null;
    quantity: number;
    reason: string | null;
    status: RentalStatusType;
    requestedAt?: string;
    approvedAt?: string | null;
    dueAt?: string | null;
    returnedAt: string | null;
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
    createdAt: string;

    member: Pick<Member, "id" | "departmentId" | "user">;
    equipment: Pick<Equipment, "id" | "name" | "status">;
}
