import {
    CreateEquipmentInputType,
    UpdateEquipmentInputType,
} from "@/schemas/manager/managerEquipmentSchema";
import axiosInstance from "@/api/axiosInstance";
import {
    CreateEquipmentUnitInputType,
    UpdateEquipmentUnitInputType,
} from "@/schemas/manager/managerEquipmentUnitSchema";
import { EquipmentUnit } from "@/types/equipmentUnit";

const createEquipment = async (input: CreateEquipmentInputType) => {
    const response = await axiosInstance.post("/equipment", input);
    return response.data.data;
};

const updateEquipment = async (equipmentId: number, input: UpdateEquipmentInputType) => {
    const response = await axiosInstance.patch(`/equipment/${equipmentId}`, input);
    return response.data.data;
};

const deleteEquipment = async (equipmentId: number) => {
    await axiosInstance.delete(`/equipment/${equipmentId}`);
};

const createUnit = async (input: CreateEquipmentUnitInputType): Promise<EquipmentUnit> => {
    const response = await axiosInstance.post("/equipment-unit", input);
    return response.data.data;
};

const updateUnit = async (
    unitId: number,
    input: UpdateEquipmentUnitInputType,
): Promise<EquipmentUnit> => {
    const response = await axiosInstance.patch(`/equipment-unit/${unitId}`, input);
    return response.data.data;
};

const deleteUnit = async (unitId: number) => {
    await axiosInstance.delete(`/equipment-unit/${unitId}`);
};

export default {
    createEquipment,
    updateEquipment,
    deleteEquipment,
    createUnit,
    updateUnit,
    deleteUnit,
};
