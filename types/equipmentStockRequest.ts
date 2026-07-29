export const RequestStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED",
};

export type RequestStatusType = (typeof RequestStatus)[keyof typeof RequestStatus];

export interface EquipmentStockRequest {
    id: number;
    equipmentId: number;
    requesterId: number;
    quantity: number;
    reason?: string;
    status: RequestStatusType;
    processedBy?: number;
    processedAt?: string;
    rejectedReason?: string;
    createdAt: string;
    updatedAt: string;
}