import axiosInstance from "@/api/axiosInstance";
import {
    MemberCreateReportInputType,
    MemberUpdateReportInputType,
} from "@/schemas/member/memberReportSchema";
import { Report } from "@/types/report";

const getReportList = async (ozId?: number): Promise<Report[]> => {
    const response = await axiosInstance.get("/report", {
        params: ozId ? { ozId } : undefined,
    });
    return response.data.data;
};

const getReportById = async (reportId: number): Promise<Report> => {
    const response = await axiosInstance.get(`/report/${reportId}`);
    return response.data.data;
};

const createReport = async (input: MemberCreateReportInputType): Promise<Report> => {
    const response = await axiosInstance.post("/report/create", input);
    return response.data.data;
};

const updateReport = async (
    reportId: number,
    input: MemberUpdateReportInputType,
): Promise<Report> => {
    const response = await axiosInstance.patch(`/report/${reportId}`, input);
    return response.data.data;
};

const deleteReport = async (reportId: number) => {
    await axiosInstance.delete(`/report/${reportId}`);
};

export default {
    getReportList,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
};
