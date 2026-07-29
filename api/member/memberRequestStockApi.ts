import { EquipmentStockRequest } from "@/types/equipmentStockRequest";
import axiosInstance from "@/api/axiosInstance";
import {
    MemberRequestStockInputType,
    MemberUpdateStockInputType,
} from "@/schemas/member/memberRequestStockSchema";

const getMyStockList = async (): Promise<EquipmentStockRequest[]> => {
    const response = await axiosInstance.get("/stock/me");
    return response.data.data;
};

const createStockRequest = async (input: MemberRequestStockInputType): Promise<EquipmentStockRequest> => {
    const response = await axiosInstance.post("/stock/create", input);
    return response.data.data;
};

const updateStockRequest = async (stockId: number, input: MemberUpdateStockInputType): Promise<EquipmentStockRequest> => {
    const response = await axiosInstance.patch(`/stock/${stockId}`, input);
    return response.data.data;
};

const deleteStockRequest = async (stockId: number) => {
    await axiosInstance.delete(`/stock/${stockId}`);
};

export default {
    getMyStockList,
    createStockRequest,
    updateStockRequest,
    deleteStockRequest,
};