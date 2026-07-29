import { z } from "zod";

export const memberRequestStockSchema = z.object({
    equipmentId: z.number().int("장비 ID를 선택해주세요."),
    quantity: z.number().int().min(1, "요청 수량은 1 이상이어야 합니다."),
    reason: z.string().optional(),
});
export type MemberRequestStockInputType = z.infer<typeof memberRequestStockSchema>;

export const MemberUpdateStockSchema = memberRequestStockSchema
    .omit({
        equipmentId: true,
    })
    .partial();
export type MemberUpdateStockInputType = z.infer<typeof MemberUpdateStockSchema>;
