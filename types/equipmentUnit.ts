import { EquipmentStatusType } from "@/types/equipment";

export interface EquipmentUnit {
    id: number;
    equipmentId: number;
    assetNumber: string;
    status: EquipmentStatusType;
    createdAt?: string;
    updatedAt?: string;
}
