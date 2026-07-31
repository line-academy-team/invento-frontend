import { View, Text, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { router, usePathname } from "expo-router";
import { FiHome, FiBox, FiClipboard, FiUser, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons";
import { MdPeople } from "react-icons/md";
import { CgOrganisation } from "react-icons/cg";
import { VscOrganization } from "react-icons/vsc";

interface FooterMenu {
    label: string;
    href: string;
    icon: IconType;
    exact?: boolean;
}

const userMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/user",
        icon: FiHome,
        exact: true,
    },
    {
        label: "장비",
        href: "/user/equipment",
        icon: FiBox,
    },
    {
        label: "대여",
        href: "/user/rental",
        icon: FiClipboard,
    },
    {
        label: "마이",
        href: "/user/my",
        icon: FiUser,
    },
];

const managerMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/manager",
        icon: FiHome,
        exact: true,
    },
    {
        label: "장비",
        href: "/manager/equipment",
        icon: FiBox,
    },
    {
        label: "대여",
        href: "/manager/rental",
        icon: FiClipboard,
    },
    {
        label: "조직",
        href: "/manager/organization",
        icon: VscOrganization,
    },
    {
        label: "마이",
        href: "/manager/my",
        icon: FiSettings,
    },
];

const adminMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/admin",
        icon: FiHome,
        exact: true,
    },
    {
        label: "유저 관리",
        href: "/admin/user",
        icon: MdPeople,
    },
    {
        label: "조직 관리",
        href: "admin/organization",
        icon: CgOrganisation,
    },
    {
        label: "마이",
        href: "admin/my",
        icon: FiUser,
    },
];

interface MainFooterProps {
    variant: "user" | "manager" | "admin";
}

function MainFooter({ variant }: MainFooterProps) {
    const pathname = usePathname();

    const menus =
        variant === "user" ? userMenus : variant === "manager" ? managerMenus : adminMenus;

    const isActiveMenu = (menu: FooterMenu) => {
        if (menu.exact) {
            return pathname === menu.href;
        }

        return pathname === menu.href || pathname.startsWith(`${menu.href}/`);
    };

    return (
        <View className={twMerge("h-[100px] w-full flex-row", "z-50")}>
            {menus.map(menu => {
                const Icon = menu.icon;
                const isActive = isActiveMenu(menu);

                const menuColor = isActive ? "#5B21B6" : "#6B7280";

                return (
                    <Pressable
                        key={menu.href}
                        // @ts-ignore
                        onPress={() => router.push(menu.href)}
                        className="flex-1 items-center justify-center"
                        style={{
                            shadowColor: "#000000",
                            shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: 0.03,
                            shadowRadius: 10,
                            elevation: 3,
                        }}>
                        <Icon size={24} color={menuColor} />

                        <Text
                            className={twMerge(
                                "mt-2 font-pretendard-medium",
                                isActive && "font-pretendard-semibold",
                            )}
                            style={{
                                color: menuColor,
                            }}>
                            {menu.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default MainFooter;
