import React from "react";
import { View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

export type BadgeStatus =
    | "승인"
    | "이용가능"
    | "반납예정"
    | "정상"
    | "반려"
    | "대여중"
    | "파손신고"
    | "정지"
    | "요청"
    | "사용중"
    | "대기"
    | "신청중"
    | "관리자";

interface BadgeProps {
    status: BadgeStatus | string;
    className?: string; // 컨테이너 스타일 덮어쓰기용
    textClassName?: string; // 텍스트 스타일 덮어쓰기용
}

const getBadgeStyles = (status: string) => {
    switch (status) {
        case "승인":
        case "이용가능":
        case "반납예정":
        case "정상":
            return { bg: "bg-success-light", text: "text-success-main" };
        case "반려":
        case "대여중":
        case "파손신고":
        case "정지":
            return { bg: "bg-error-light", text: "text-error-main" };
        case "요청":
        case "사용중":
            return { bg: "bg-primary-light", text: "text-primary-main" };
        case "대기":
        case "신청중":
            return { bg: "bg-warning-light", text: "text-warning-main" };
        case "관리자":
            return { bg: "bg-[#C5DAFD]", text: "text-secondary-main" };
        case "오너":
            return {
                bg: "border border-secondary-main",
                text: "text-secondary-main",
            };
        default:
            return { bg: "bg-background-deep", text: "text-text-secondary" };
    }
};

function Badge({ status, className, textClassName }: BadgeProps) {
    const styles = getBadgeStyles(status);

    return (
        <View
            className={twMerge(
                "w-[72px] h-[24px] rounded-[16px] items-center justify-center",
                styles.bg,
                className,
            )}>
            <Text
                className={twMerge("font-pretendard-bold text-[14px]", styles.text, textClassName)}>
                {status}
            </Text>
        </View>
    );
}

export default Badge;
