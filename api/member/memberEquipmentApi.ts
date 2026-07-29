import { Equipment } from "@/types/equipment";
import axiosInstance from "@/api/axiosInstance";
import { EquipmentUnit } from "@/types/equipmentUnit";

const getEquipmentList = async (): Promise<Equipment[]> => {
    const response = await axiosInstance.get("/equipment");
    return response.data.data;
};

const getEquipmentById = async (equipmentId: number): Promise<Equipment> => {
    const response = await axiosInstance.get(`/equipment/${equipmentId}`);
    return response.data.data;
};

const getUnitByEquipmentId = async (equipmentId: number): Promise<EquipmentUnit> => {
    const response = await axiosInstance.get(`/equipment-unit/${equipmentId}`);
    return response.data.data;
}

export default {
    getEquipmentList,
    getEquipmentById,
    getUnitByEquipmentId,
};