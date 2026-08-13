import axiosInstance from "@/api/axiosInstance";
import { Report, ReportTypes } from "@/types/report";

const getReportList = async (ozId: number): Promise<Report[]> => {
    const response = await axiosInstance.get("/report", { params: { ozId } });
    return response.data.data;
};

const getReportById = async (reportId: number): Promise<Report> => {
    const response = await axiosInstance.get(`/report/${reportId}`);
    return response.data.data;
};

const processReport = async (
    reportId: number,
    input: { type: ReportTypes; result: string },
): Promise<Report> => {
    const response = await axiosInstance.patch(`/report/${reportId}/process`, input);
    return response.data.data;
};

export default { getReportList, getReportById, processReport };
