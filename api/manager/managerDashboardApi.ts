import axiosInstance from "@/api/axiosInstance";

export type DashboardRentalStatus =
    | "REQUESTED"
    | "REJECTED"
    | "BORROWED"
    | "RETURNED"
    | "CANCELLED";

export interface ManagerDashboardSummary {
    totalEquipment: number;
    borrowed: number;
    requested: number;
    brokenReports: number;
}

export interface ManagerDashboardRecentRental {
    id: number;
    equipment: string;
    name: string;
    date: string;
    status: DashboardRentalStatus;
}

export interface ManagerDashboardData {
    summary: ManagerDashboardSummary;
    recentRentals: ManagerDashboardRecentRental[];
}

const getDashboard = async (): Promise<ManagerDashboardData> => {
    const response = await axiosInstance.get("/manager/dashboard");
    return response.data.data;
};

export default {
    getDashboard,
};
