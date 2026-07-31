import axiosInstance from "@/api/axiosInstance";
import { Organization } from "@/types/organization";

export interface OrganizationInput {
    name: string;
    description?: string;
    logoUrl?: string;
    inviteCode: string;
}

export interface JoinOrganizationInput {
    inviteCode: string;
    department?: string;
}

const getOrganizationById = async (id: number): Promise<Organization> => {
    const response = await axiosInstance.get(`/organization/${id}`);
    return response.data.data;
};

const createOrganization = async (data: OrganizationInput): Promise<Organization> => {
    const response = await axiosInstance.post("/organization/create", data);
    return response.data.data;
};

const updateOrganization = async (id: number, data: OrganizationInput): Promise<Organization> => {
    const response = await axiosInstance.patch(`/organization/${id}/update`, data);
    return response.data.data;
};

const deleteOrganization = async (id: number): Promise<void> => {
    const response = await axiosInstance.patch(`/organization/${id}/delete`);
    return response.data.data;
};

const joinOrganization = async (data: JoinOrganizationInput) => {
    const response = await axiosInstance.post("/organization/join", data);
    return response.data.data;
};

export default {
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    joinOrganization,
};
