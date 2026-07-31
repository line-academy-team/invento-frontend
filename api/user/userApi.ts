import axiosInstance from "@/api/axiosInstance";
import { AuthUser, GetMeResponse, LoginResponse, User } from "@/types/user";
import { UserSignupType } from "@/schemas/user/registerUserSchema";
import { LoginInputType } from "@/schemas/user/loginUserSchema";
import { UpdatePasswordInputType } from "@/schemas/user/updatePasswordSchema";

const registerUser = async (data: UserSignupType): Promise<User> => {
    const response = await axiosInstance.post("/user/signup", data);
    return response.data.data;
};

const login = async (data: LoginInputType): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
};

const getMe = async (): Promise<AuthUser> => {
    const response = await axiosInstance.get("/user/me");
    return response.data.data;
};

const updatePassword = async (data: UpdatePasswordInputType): Promise<void> => {
    const response = await axiosInstance.patch("/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
    });

    return response.data.data;
};

export default {
    registerUser,
    login,
    getMe,
    updatePassword,
};