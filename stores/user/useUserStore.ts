import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AuthUser, MemberInfo } from "@/types/user";
import ExpoSecureStore from "expo-secure-store/src/ExpoSecureStore";

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

            logout: () => {
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
                const token = await SecureStore.getItemAsync("accessToken");

                if (!token) {
                    set({
                        isLoggedIn: false,
                        token: null,
                        authUser: null,
                        isInitializing: false,
                    });
                    return;
                }

                try {
                    const result = await userApi.getMe(token);

                    set({
                        isLoggedIn: true,
                        token,
                        authUser: {
                            user: result.user,
                            memberInfo: result.memberInfo ?? null,
                        },
                        isInitializing: false,
                    });
                } catch {
                    await SecureStore.deleteItemAsync("accessToken");

                    set({
                        isLoggedIn: false,
                        token: null,
                        authUser: null,
                        isInitializing: false,
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
