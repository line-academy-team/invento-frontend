import { MyRental } from "@/types/rental";
import axiosInstance from "@/api/axiosInstance";
import { UserRequestRentalInputType, UserUpdateRentalInputType } from "@/schemas/userRequestRentalSchema";

const getMyRentalRequestList = async (): Promise<MyRental[]> => {
    const response = await axiosInstance.get("/rental/me");
    return response.data.data;
};

const createRentalRequest = async (input: UserRequestRentalInputType): Promise<MyRental> => {
    const response = await axiosInstance.post("/rental/request", input);
    return response.data.data;
};

const updateRentalRequest = async (rentalId: number, input: UserUpdateRentalInputType): Promise<MyRental> => {
    const response = await axiosInstance.patch(`/rental/${rentalId}`, input);
    return response.data.data;
};

const deleteRentalRequest = async (rentalId: number) => {
    await axiosInstance.delete(`rental/${rentalId}`);
};

export default {
    getMyRentalRequestList,
    createRentalRequest,
    updateRentalRequest,
    deleteRentalRequest,
};