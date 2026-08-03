import { z } from "zod";

export const updateMemberStatusSchema = z.object({
    memberIds: z.array(z.number().int()).min(1, "최소 한 명 이상의 멤버를 선택해 주세요."),
    status: z.enum(["APPROVED", "REJECTED"], {
        message: "올바른 상태값을 선택해 주세요.",
    }),
    rejectedReason: z.string().max(255, "거절 사유는 최대 255자입니다.").optional(), // 반려 시

    departmentId: z.number().int().nullable().optional(),
    memo: z.string().max(255).optional(),
    sendNotification: z.boolean().optional(),
});
export type UpdateMemberStatusInputType = z.infer<typeof updateMemberStatusSchema>;

export const createDepartmentSchema = z.object({
    name: z.string().min(1, "부서명을 입력해 주세요.").max(50, "부서명은 최대 50자입니다."),
    description: z.string().max(255, "부서 설명은 최대 255자입니다.").optional(),
});
export type CreateDepartmentInputType = z.infer<typeof createDepartmentSchema>;

export const updateMemberRoleSchema = z.object({
    memberId: z.number().int("올바른 멤버 ID를 입력해 주세요."),
    role: z.enum(["MANAGER", "MEMBER"], {
        message: "올바른 권한을 선택해 주세요.",
    }),
});
export type UpdateMemberRoleInputType = z.infer<typeof updateMemberRoleSchema>;

export const moveMemberDepartmentSchema = z.object({
    memberId: z.number().int("올바른 멤버 ID를 입력해 주세요."),
    departmentId: z.number().int().nullable(),
});
export type MoveMemberDepartmentInputType = z.infer<typeof moveMemberDepartmentSchema>;
