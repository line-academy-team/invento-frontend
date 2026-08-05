import axiosInstance from "@/api/axiosInstance";

export interface Department {
    id: number;
    name: string;
    createdAt: string;
}

const getDepartmentList = async (): Promise<Department[]> => {
    const response = await axiosInstance.get("/owner/department");
    return response.data.data;
};

const createDepartment = async (name: string): Promise<Department> => {
    const response = await axiosInstance.post("/owner/department/create", { name });
    return response.data.data;
};

const deleteDepartment = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/owner/department/${id}`);
};

const assignDepartmentManager = async (departmentId: number, memberId: number) => {
    const response = await axiosInstance.patch(`/owner/department/${departmentId}/manager`, {
        memberId,
    });
    return response.data;
};

export default {
    getDepartmentList,
    createDepartment,
    deleteDepartment,
    assignDepartmentManager,
};
