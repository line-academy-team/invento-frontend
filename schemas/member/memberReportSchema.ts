import { z } from "zod";
import { ReportType, ReportTypes } from "@/types/report";

export const memberReportSchema = z.object({
    equipmentId: z.number().int().optional(),
    type: z.custom<ReportTypes>(
        val => typeof val === "string" && Object.values(ReportType).includes(val),
        { message: "올바른 보고 유형을 선택해주세요." },
    ),
    title: z.string().min(1, "제목을 입력해주세요.").max(100),
    content: z.string().min(1, "내용을 입력해주세요."),
});
export type MemberCreateReportInputType = z.infer<typeof memberReportSchema>;

export const memberUpdateReportSchema = memberReportSchema
    .omit({
        equipmentId: true,
    })
    .partial();
export type MemberUpdateReportInputType = z.infer<typeof memberUpdateReportSchema>;
