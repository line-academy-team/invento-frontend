import axiosInstance from "@/api/axiosInstance";
import { User } from "@/types/user";
import { AdminUpdateUserInputType } from "@/schemas/admin/user/adminUpdateUserSchema";
import { AdminUpdateOrganizationInputType } from "@/schemas/admin/organization/adminUpdateOrganizationSchema";
import { OrganizationCount } from "@/types/organization";

const getUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get("/admin/user");
    return response.data.data;
};

const getUserById = async (userId: number): Promise<User> => {
    const response = await axiosInstance.get(`/admin/user/${userId}`);
    return response.data.data;
};

const updateUser = async (userId: number, input: AdminUpdateUserInputType) => {
    const response = await axiosInstance.patch(`/admin/user/${userId}`, input);
    return response.data.data;
};

const getOrganizations = async (): Promise<OrganizationCount[]> => {
    const response = await axiosInstance.get("/admin/organization");
    return response.data.data;
};

const getOrganizationById = async (orgId: number): Promise<OrganizationCount | null> => {
    const response = await axiosInstance.get(`/admin/organization/${orgId}`);
    return response.data.data;
}

const updateOrganization = async (orgId: number, input: AdminUpdateOrganizationInputType) => {
    const response = await axiosInstance.patch(`/admin/organization/${orgId}`, input);
    return response.data.data;
}

export default {
    getUsers,
    getUserById,
    updateUser,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
};