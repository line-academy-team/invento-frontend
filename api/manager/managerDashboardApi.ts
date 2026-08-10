import axiosInstance from "@/api/axiosInstance";

export type DashboardRentalStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "BORROWED" | "RETURNED";

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

const getDashboard = async (organizationId: number): Promise<ManagerDashboardData> => {
    const response = await axiosInstance.get(`/manager/dashboard/${organizationId}`);
    return response.data.data;
};

export default {
    getDashboard,
};
