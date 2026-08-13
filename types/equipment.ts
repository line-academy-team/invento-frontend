import { EquipmentUnit } from "@/types/equipmentUnit";

export type EquipmentType = "INDIVIDUAL" | "CONSUMABLE";

export type EquipmentStatusType = "AVAILABLE" | "BORROWED" | "LOST" | "BROKEN" | "DISPOSED";

export interface Equipment {
    id: number;
    organizationId: number;
    departmentId: number | null;
    name: string;
    category: string | null;
    description: string | null;
    imageUrl: string | null;
    type: EquipmentType;
    totalQuantity: number;
    availableQuantity: number;
    status: EquipmentStatusType;
    createdBy: number;
    createdAt: string;
    updatedAt?: string;

    department?: {
        id: number;
        name: string;
    } | null;
    units?: EquipmentUnit[];
}
