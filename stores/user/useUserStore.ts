import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user";
import { Platform } from "react-native";

type UserState = {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;

    // Actions
    login: (user: User, token: string) => void;
    logout: VoidFunction;
    updateUser: (partialUser: Partial<User>) => void;
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
            user: null,

            login: (user, token) => set({ isLoggedIn: true, token, user }),

            logout: () => set({ isLoggedIn: false, token: null, user: null }),

            updateUser: partialUser =>
                set(state => ({
                    user: state.user ? { ...state.user, ...partialUser } : null,
                })),
        }),
        {
            name: "user-storage",
            storage,
        },
    ),
);