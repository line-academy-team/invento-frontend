import axiosInstance from "@/api/axiosInstance";
import { GetMeResponse, LoginResponse, MemberInfo, User } from "@/types/user";
import { UserSignupInputType } from "@/schemas/user/registerUserSchema";
import { LoginInputType } from "@/schemas/user/loginUserSchema";

const registerUser = async (data: UserSignupInputType): Promise<User> => {
    const response = await axiosInstance.post("/user/signup", data);
    return response.data.data;
};

const login = async (data: LoginInputType): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
};

const getMe = async (): Promise<GetMeResponse> => {
    const response = await axiosInstance.get("/user/me");
    return response.data.data;
};

export default {
    registerUser,
    login,
    getMe,
};
