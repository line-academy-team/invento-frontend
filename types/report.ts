export const ReportType = {
    LOST: "LOST",
    BROKEN: "BROKEN",
    SHORTAGE: "SHORTAGE",
    EXCESS: "EXCESS",
    ETC: "ETC",
};

export type ReportTypes = (typeof ReportType)[keyof typeof ReportType];

export const ReportStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
};

export type ReportStatusType = (typeof ReportStatus)[keyof typeof ReportStatus];

export interface Report {
    id: number;
    equipmentId?: number;
    reporterId: number;
    type: ReportTypes;
    status: ReportStatusType;
    title: string;
    content: string;
    processedBy?: number;
    processedAt?: string;
    result?: string;
    createdAt: string;
    updatedAt?: string;

    reporter?: {
        id: number;
        role?: string;
        user: {
            name: string;
            email?: string;
        };
        department?: {
            id: number;
            name: string;
        } | null;
    };
    equipment?: {
        id: number;
        name: string;
        imageUrl: string | null;
        category: string | null;
    } | null;
}
