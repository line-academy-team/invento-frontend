import { Equipment } from "@/types/equipment";
import axiosInstance from "@/api/axiosInstance";
import { EquipmentUnit } from "@/types/equipmentUnit";

interface GetEquipmentListParams {
    category?: string;
    search?: string;
}

const getEquipmentList = async (params?: GetEquipmentListParams): Promise<Equipment[]> => {
    const response = await axiosInstance.get("/equipment", {
        params: {
            ...(params?.category && { category: params.category }),
            ...(params?.search && { search: params.search }),
        },
    });

    return response.data.data;
};

const getEquipmentById = async (equipmentId: number): Promise<Equipment> => {
    const response = await axiosInstance.get(`/equipment/${equipmentId}`);
    return response.data.data;
};

const getUnitByEquipmentId = async (equipmentId: number): Promise<EquipmentUnit> => {
    const response = await axiosInstance.get(`/equipment-unit/${equipmentId}`);
    return response.data.data;
};

export default {
    getEquipmentList,
    getEquipmentById,
    getUnitByEquipmentId,
};
