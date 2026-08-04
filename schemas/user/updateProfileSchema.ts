import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "이름을 입력해주세요.")
        .max(50, "이름은 50자 이하로 입력해주세요."),

    imageUrl: z.string().optional(),
});

export type UpdateProfileInputType = z.infer<typeof updateProfileSchema>;
