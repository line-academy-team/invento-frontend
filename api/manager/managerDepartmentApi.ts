import axiosInstance from "@/api/axiosInstance";

export interface OrgMemberUser {
    id: number;
    name: string;
    email: string;
}

export interface OrgMemberDepartment {
    id: number;
    name: string;
}

export interface OrgMember {
    id: number;
    role: string;
    user: OrgMemberUser;
    department?: OrgMemberDepartment | null;
}

const getOrgMemberList = async (search?: string): Promise<OrgMember[]> => {
    const response = await axiosInstance.get("/manager/department", {
        params: { search },
    });
    return response.data.data;
};

const transferDepartment = async (data: { memberIds: number[]; targetDepartmentId: number }) => {
    const response = await axiosInstance.patch("/manager/department/transfer", data);
    return response.data;
};

export default {
    getOrgMemberList,
    transferDepartment,
};
