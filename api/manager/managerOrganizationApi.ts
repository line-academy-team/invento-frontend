import axiosInstance from "@/api/axiosInstance";
import { Member } from "@/types/member";
import { Department } from "@/types/department";
import { UpdateMemberStatusInputType } from "@/schemas/manager/managerOrganizationSchema";

// 1. 단체 정보 및 전체 멤버 목록 조회
const getOrganizationDetail = async (ozId: number) => {
    const response = await axiosInstance.get(`/organization/${ozId}`);
    return response.data.data;
};

// 2. 가입 신청 승인 / 반려 (일괄 및 상세 공통 사용)
const updateMemberStatus = async (
    ozId: number,
    data: UpdateMemberStatusInputType, // 👈 여기서 타입을 연결해줍니다!
) => {
    const response = await axiosInstance.patch(`/organization/${ozId}/members/status`, data);
    return response.data;
};

// 3. 부서 생성
const createDepartment = async (
    ozId: number,
    data: { name: string; description?: string },
): Promise<Department> => {
    const response = await axiosInstance.post(`/organization/${ozId}/department`, data);
    return response.data.data;
};

// 4. 부서 관리자 임명
const updateMemberRole = async (
    ozId: number,
    data: { memberId: number; role: "MANAGER" | "MEMBER" },
) => {
    const response = await axiosInstance.patch(`/organization/${ozId}/members/role`, data);
    return response.data;
};

// 5. 부서 이동
const moveMemberDepartment = async (
    ozId: number,
    data: { memberId: number; departmentId: number | null },
) => {
    const response = await axiosInstance.patch(`/organization/${ozId}/members/department`, data);
    return response.data;
};

export default {
    getOrganizationDetail,
    updateMemberStatus,
    createDepartment,
    updateMemberRole,
    moveMemberDepartment,
};
