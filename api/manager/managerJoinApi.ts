import axiosInstance from "@/api/axiosInstance";

export interface JoinRequestUser {
    id: number;
    name: string;
    email: string;
}

export interface JoinRequestDepartment {
    id: number;
    name: string;
}

export interface JoinRequestMember {
    id: number;
    status: string;
    createdAt: string;
    user: JoinRequestUser;
    department?: JoinRequestDepartment | null;
}
export interface JoinRequestDetail extends JoinRequestMember {
    organization: { name: string };
    departments: JoinRequestDepartment[];
}
const getJoinRequestList = async (search?: string): Promise<JoinRequestMember[]> => {
    const response = await axiosInstance.get("/manager/join", {
        params: { search },
    });
    return response.data.data;
};

const processJoinRequest = async (data: {
    memberIds: number[];
    status: "APPROVED" | "REJECTED";
    departmentId?: number;
    rejectedReason?: string;
}) => {
    const response = await axiosInstance.patch("/manager/join/process", data);
    return response.data;
};

const getJoinRequestById = async (id: number): Promise<JoinRequestDetail> => {
    const response = await axiosInstance.get(`/manager/join/${id}`);
    return response.data.data;
};

export default {
    getJoinRequestList,
    processJoinRequest,
    getJoinRequestById,
};
