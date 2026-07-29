import {
    CreateEquipmentInputType,
    UpdateEquipmentInputType,
} from "@/schemas/manager/managerEquipmentSchema";
import axiosInstance from "@/api/axiosInstance";

const createEquipment = async (input: CreateEquipmentInputType) => {
    const response = await axiosInstance.post("/equipment/create", input);
    return response.data.data;
};

const updateEquipment = async (equipmentId: number, input: UpdateEquipmentInputType) => {
    const response = await axiosInstance.patch(`/equipment/${equipmentId}`, input);
    return response.data.data;
};

const deleteEquipment = async (equipmentId: number) => {
    await axiosInstance.delete(`/equipment/${equipmentId}`);
};

export default {
    createEquipment,
    updateEquipment,
    deleteEquipment,
};