import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AuthUser, MemberInfo } from "@/types/user";
import ExpoSecureStore from "expo-secure-store/src/ExpoSecureStore";
import userApi from "@/api/user/userApi";

type UserState = {
    isLoggedIn: boolean;
    token: string | null;
    authUser: AuthUser | null;

    login: (authUser: AuthUser, token: string) => void;
    logout: VoidFunction;
    updateMemberInfo: (memberInfo: Partial<MemberInfo>) => void;
    restoreLogin: VoidFunction;
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
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
                await ExpoSecureStore.delete("accessToken");

                set({
                    isLoggedIn: false,
                    token: null,
                    authUser: null,
                });
            },
            updateMemberInfo: memberInfo =>
                set(state => ({
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
            restoreLogin: async () => {
                const token = await ExpoSecureStore.getItem("accessToken");

                if (!token) {
                    set({
                        isLoggedIn: false,
                        token: null,
                        authUser: null,
                    });
                    return;
                }

                try {
                    const result = await userApi.getMe();

                    set({
                        isLoggedIn: true,
                        token,
                        authUser: {
                            user: result,
                            memberInfo: null,
                        },
                    });
                } catch {
                    await ExpoSecureStore.delete("accessToken");

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
        },
    ),
);
