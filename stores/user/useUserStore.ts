import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AuthUser, MemberInfo, User } from "@/types/user";
import * as SecureStore from "expo-secure-store";

type UserState = {
    isLoggedIn: boolean;
    token: string | null;
    authUser: AuthUser | null;

    login: (authUser: AuthUser, token: string) => void;

    logout: () => Promise<void>;

    updateUserInfo: (userInfo: Partial<User>) => void;

    updateMemberInfo: (memberInfo: Partial<MemberInfo>) => void;

    restoreLogin: () => Promise<void>;
};

const customWebStorage: StateStorage = {
    getItem: name => {
        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem(name);
    },

    setItem: (name, value) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(name, value);
        }
    },

    removeItem: name => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(name);
        }
    },
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => customWebStorage)
        : createJSONStorage(() => AsyncStorage);

export const useUserStore = create<UserState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            authUser: null,

            login: (authUser, token) =>
                set({
                    isLoggedIn: true,
                    token,
                    authUser,
                }),

            logout: async () => {
                if (Platform.OS === "web") {
                    localStorage.removeItem("accessToken");
                } else {
                    await SecureStore.deleteItemAsync("accessToken");
                }

                set({
                    isLoggedIn: false,
                    token: null,
                    authUser: null,
                });
            },

            updateUserInfo: userInfo =>
                set(state => {
                    if (!state.authUser) {
                        return state;
                    }

                    return {
                        authUser: {
                            ...state.authUser,
                            user: {
                                ...state.authUser.user,
                                ...userInfo,
                            },
                        },
                    };
                }),

            updateMemberInfo: memberInfo =>
                set(state => {
                    if (!state.authUser || !state.authUser.memberInfo) {
                        return state;
                    }

                    return {
                        authUser: {
                            ...state.authUser,
                            memberInfo: {
                                ...state.authUser.memberInfo,
                                ...memberInfo,
                            },
                        },
                    };
                }),

            restoreLogin: async () => {
                let token: string | null;

                if (Platform.OS === "web") {
                    token = localStorage.getItem("accessToken");
                } else {
                    token = await SecureStore.getItemAsync("accessToken");
                }

                if (!token) {
                    token = useUserStore.getState().token;
                }

                if (!token) {
                    set({
                        isLoggedIn: false,
                        token: null,
                        authUser: null,
                    });

                    return;
                }

                set({
                    token,
                });

                try {
                    const userApi = require("@/api/user/userApi").default;

                    const authUser = await userApi.getMe();

                    set({
                        isLoggedIn: true,
                        token,
                        authUser,
                    });
                } catch (error) {
                    console.error("로그인 복원 실패:", error);

                    if (Platform.OS === "web") {
                        localStorage.removeItem("accessToken");
                    } else {
                        await SecureStore.deleteItemAsync("accessToken");
                    }

                    set({
                        isLoggedIn: false,
                        token: null,
                        authUser: null,
                    });
                }
            },
        }),
        {
            name: "user-storage",
            storage,

            partialize: state => ({
                isLoggedIn: state.isLoggedIn,
                authUser: state.authUser,
                token: state.token,
            }),
        },
    ),
);
