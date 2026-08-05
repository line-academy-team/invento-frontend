import { z } from "zod";
import type { UserRole } from "@/types/user";

export const adminUpdateUserSchema = z.object({
    name: z.string().min(1, "이름을 입력해주세요.").max(50).optional(),
    role: z.enum(["USER", "ADMIN"] as const satisfies readonly UserRole[]).optional(),
    isDeleted: z.boolean().optional(), // true: 계정 정지(삭제), false: 복구
});

export type AdminUpdateUserInputType = z.infer<typeof adminUpdateUserSchema>;
