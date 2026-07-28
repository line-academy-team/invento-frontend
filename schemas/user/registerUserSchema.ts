import { z } from "zod";

const baseSignupSchema = z.object({
    email: z.string().email("유효한 이메일 주소를 입력해주세요.").max(100),
    password: z.string().min(6, "비밀번호를 6자 이상으로 입력해주세요.").max(255),
    confirmPassword: z.string().min(6, "비밀번호 확인을 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요.").max(50),
});

export const userSignupInputSchema = baseSignupSchema.refine(
    data => data.password === data.confirmPassword,
    {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
    },
);

export type UserSignupInputType = z.infer<typeof userSignupInputSchema>;

export const userSignupSchema = baseSignupSchema.omit({
    confirmPassword: true,
});

export type UserSignupType = z.infer<typeof userSignupSchema>;
