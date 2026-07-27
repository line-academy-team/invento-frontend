import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useRootNavigationState } from "expo-router";

import { useUserStore } from "@/stores/user/useUserStore";

export default function IndexPage() {
    const navigationState = useRootNavigationState();

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!navigationState?.key) {
            return;
        }

        if (hasInitialized.current) {
            return;
        }

        hasInitialized.current = true;

        let isMounted = true;

        const initializeAuth = async () => {
            try {
                // persist 복원이 끝나지 않은 경우
                if (!useUserStore.persist.hasHydrated()) {
                    await new Promise<void>(resolve => {
                        const unsubscribe = useUserStore.persist.onFinishHydration(() => {
                            unsubscribe();
                            resolve();
                        });
                    });
                }

                if (!isMounted) {
                    return;
                }

                await useUserStore.getState().restoreLogin();

                if (!isMounted) {
                    return;
                }
                const { isLoggedIn, token, authUser, logout } = useUserStore.getState();

                if (!isLoggedIn || !token || !authUser) {
                    router.replace("/auth/login");
                    return;
                }

                const { user, memberInfo } = authUser;

                if (
                    !user.id ||
                    !user.email ||
                    !user.name ||
                    !["USER", "ADMIN"].includes(user.role)
                ) {
                    await logout();
                    if (isMounted) {
                        router.replace("/auth/login");
                    }
                    return;
                }

                /*
                 * 조직에 아직 가입하지 않은 사용자
                 */
                if (!memberInfo) {
                    router.replace("/organization/join");
                    return;
                }

                const validRoles = ["OWNER", "MANAGER", "MEMBER"];

                const validStatuses = ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"];

                if (
                    !memberInfo.id ||
                    !memberInfo.organizationId ||
                    !validRoles.includes(memberInfo.role) ||
                    !validStatuses.includes(memberInfo.status)
                ) {
                    await logout();

                    if (isMounted) {
                        router.replace("/auth/login");
                    }

                    return;
                }

                if (memberInfo.status !== "APPROVED") {
                    router.replace("/status");
                    return;
                }

                switch (memberInfo.role) {
                    case "OWNER":
                    case "MANAGER":
                        router.replace("/manager");
                        return;

                    case "MEMBER":
                        router.replace("/user");
                        return;

                    default:
                        await logout();

                        if (isMounted) {
                            router.replace("/auth/login");
                        }
                }
            } catch (error) {
                console.error("초기 로그인 검증 실패:", error);

                await useUserStore.getState().logout();

                if (isMounted) {
                    router.replace("/auth/login");
                }
            }
        };

        void initializeAuth();

        return () => {
            isMounted = false;
        };
    }, [navigationState?.key]);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" />
        </View>
    );
}
