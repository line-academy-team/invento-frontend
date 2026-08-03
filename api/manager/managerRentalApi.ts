import axiosInstance from "@/api/axiosInstance";
import { OrgRental } from "@/types/rental";

const getOrgRentalRequestList = async (ozId: number): Promise<OrgRental[]> => {
    const response = await axiosInstance.get(`/rental/${ozId}`);
    return response.data.data;
};

export default { getOrgRentalRequestList };