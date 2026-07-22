import axiosInstance from "@/api/axiosInstance";
import { User } from "@/types/user";
import { UserSignupInputType } from "@/schemas/user/userSignupSchema";
import { LoginInputType } from "@/schemas/user/loginSchema";
import { UpdateUserInputType } from "@/schemas/user/updateUserSchema";
import { UpdatePasswordInputType } from "@/schemas/user/updatePasswordSchema";
import { WithdrawUserInputType } from "@/schemas/user/withdrawUserSchema";

const registerUser = async (
    data: UserSignupInputType,
): Promise<User> => {
    const response = await axiosInstance.post("/user/signup", data);
    return response.data.data;
};

const login = async (
    data: LoginInputType,
): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
};

const getMe = async (): Promise<User> => {
    const response = await axiosInstance.get("/user/me");
    return response.data.data;
};

const updateUser = async (data: UpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch("/user/update", data);
    return response.data.data;
};

const updatePassword = async (
    data: Omit<UpdatePasswordInputType, "confirmPassword">,
): Promise<void> => {
    await axiosInstance.patch("/user/password", data);
};

const withdrawUser = async (data: WithdrawUserInputType): Promise<void> => {
    await axiosInstance.patch("/user/withdraw", data);
};

export default {
    registerUser,
    login,
    getMe,
    updateUser,
    updatePassword,
    withdrawUser,
};