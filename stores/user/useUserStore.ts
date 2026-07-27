import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AuthUser, MemberInfo } from "@/types/user";

type UserState = {
    isLoggedIn: boolean;
    token: string | null;
    authUser: AuthUser | null;

    login: (authUser: AuthUser, token: string) => void;
    logout: VoidFunction;
    updateMemberInfo: (memberInfo: Partial<MemberInfo>) => void;
};

const customWebStorage: StateStorage = {
    getItem: (name) => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(name);
    },
    setItem: (name, value) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(name, value);
        }
    },
    removeItem: (name) => {
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
        (set) => ({
            isLoggedIn: false,
            token: null,
            authUser: null,

            login: (authUser, token) =>
                set({
                    isLoggedIn: true,
                    token,
                    authUser,
                }),

            logout: () =>
                set({
                    isLoggedIn: false,
                    token: null,
                    authUser: null,
                }),

            updateMemberInfo: (memberInfo) =>
                set((state) => ({
                    authUser: state.authUser
                        ? {
                            ...state.authUser,
                            memberInfo: {
                                ...state.authUser.memberInfo,
                                ...memberInfo,
                            } as MemberInfo,
                        }
                        : null,
                })),
        }),
        {
            name: "user-storage",
            storage,
        }
    )
);