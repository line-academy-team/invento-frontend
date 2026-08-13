import axiosInstance from "@/api/axiosInstance";
import { OrgRental } from "@/types/rental";

const getOrgRentalRequestList = async (ozId: number): Promise<OrgRental[]> => {
    const response = await axiosInstance.get(`/rental/${ozId}`);
    return response.data.data;
};

const getOrgRentalById = async (ozId: number, rentalId: number): Promise<OrgRental> => {
    const response = await axiosInstance.get(`/rental/${ozId}/${rentalId}`);
    return response.data.data;
};

interface ProcessRentalInput {
    status: "BORROWED" | "REJECTED";
    rejectedReason?: string;
}

const processRental = async (
    ozId: number,
    rentalId: number,
    input: ProcessRentalInput,
): Promise<OrgRental> => {
    const response = await axiosInstance.patch(`/rental/${ozId}/${rentalId}/process`, input);
    return response.data.data;
};

export default { getOrgRentalRequestList, getOrgRentalById, processRental };
