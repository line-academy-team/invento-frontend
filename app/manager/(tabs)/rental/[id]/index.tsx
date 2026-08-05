import React, { useState } from "react";
import { ScrollView, Text, View, Modal, TextInput, Pressable, Alert } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";

function ManagerRentalRequestDetailPage() {
    const router = useRouter();

    // 승인 모달 및 입력 상태 관리
    const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
    const [memo, setMemo] = useState("");

    // 반려 모달 및 입력 상태 관리
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectMemo, setRejectMemo] = useState("");

    // 승인 완료 핸들러
    const handleApproveComplete = () => {
        setIsApproveModalVisible(false);
        // Alert 띄우고 확인 누르면 리스트 페이지로 이동
        Alert.alert("승인 완료", "승인 처리가 완료되었습니다.", [
            {
                text: "확인",
                onPress: () => {
                    // TODO: 아래에 리스트 페이지 경로를 입력해주세요
                    router.navigate("여기에_리스트_페이지_경로_입력");
                },
            },
        ]);
        setMemo(""); // 필요시 메모 초기화
    };

    // 반려 완료 핸들러
    const handleRejectComplete = () => {
        setIsRejectModalVisible(false);
        // Alert 띄우고 확인 누르면 리스트 페이지로 이동
        Alert.alert("반려 완료", "반려 처리가 완료되었습니다.", [
            {
                text: "확인",
                onPress: () => {
                    // TODO: 아래에 리스트 페이지 경로를 입력해주세요
                    router.navigate("여기에_리스트_페이지_경로_입력");
                },
            },
        ]);
        setRejectMemo(""); // 필요시 반려 사유 초기화
    };

    return (
        <View className={"flex-1 bg-white"}>
            <MainHeader
                title={"대여 요청 상세"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/rental");
                }}
            />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] pt-1 pb-8 flex-1"}>
                    <View className={"flex-1"}>
                        {/* 신청정보 영역 */}
                        <View className={"border-b border-divider py-5 mb-3"}>
                            <View className={twMerge(["pb-3 mb-2 border-b border-text-default"], ["flex-row justify-between items-center"])}>
                                <Text className={"text-lg font-semibold"}>신청정보</Text>
                                <Badge status={"대기"} />
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    신청일시
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    2026-07-22 14:30
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    신청자
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    김행사 대리 (010-1234-5678)
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "pt-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    소속
                                </Text>
                                <Text className={"text-text-default text-base"}>마케팅 / 사원</Text>
                            </View>
                        </View>

                        {/* 장비정보 영역 */}
                        <View className={"py-5 mb-3"}>
                            <Text className={"pb-3 text-lg font-semibold"}>장비정보</Text>
                            <View
                                className={twMerge(
                                    ["bg-background-default", "rounded-2xl", "p-5"],
                                    ["flex-row"],
                                )}>
                                <View>
                                    <Feather
                                        name={"image"}
                                        size={36}
                                        className={"text-text-secondary mr-4"}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className={twMerge([
                                            "text-text-default",
                                            "text-xl",
                                            "font-semibold",
                                        ])}>
                                        노트북SN0001
                                    </Text>
                                    <Text className={"py-2 text-sm text-text-secondary"}>
                                        IT 기기/ 노트북
                                    </Text>
                                    <Text className={"text-sm text-text-secondary"}>수량1</Text>
                                </View>
                            </View>
                        </View>

                        {/* 대여정보 영역 */}
                        <View className={"border-b border-divider py-5 mb-3"}>
                            <Text
                                className={
                                    "pb-3 mb-2 border-b border-text-default text-lg font-semibold"
                                }>
                                대여정보
                            </Text>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    대여기간
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    2026-07-20 ~ 2026-07-28
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-lg font-semibold"}>
                                    사용목적
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    코엑스 행사 준비
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "pt-3",
                                    "pb-5",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-lg font-semibold"}>
                                    추가메모
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    노트북 거치대도 함께 대여 요청드립니다.
                                </Text>
                            </View>
                        </View>

                        {/* 예상 반납일 영역 */}
                        <View className={"py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["bg-background-deep", "rounded-2xl", "p-5"],
                                    ["flex-row", "justify-between"],
                                )}>
                                <Text className={"text-text-default font-semibold"}>
                                    예상 반납일
                                </Text>
                                <Text className={"text-text-default"}>2026-07-30(목)</Text>
                            </View>
                        </View>
                    </View>

                    {/* 하단 버튼 */}
                    <View className={twMerge(["flex-row", "w-full", "gap-2"])}>
                        <Button
                            variant={"outline"}
                            className={"h-[60px] w-auto flex-1"}
                            textClassName={"text-xl text-red-500"} // 텍스트 컬러 지정(필요에 따라 수정)
                            onPress={() => setIsRejectModalVisible(true)} // 반려 모달 열기
                        >
                            반려
                        </Button>
                        <Button
                            className={"h-[60px] w-auto flex-1 bg-purple-700"}
                            textClassName={"text-xl text-white"}
                            onPress={() => setIsApproveModalVisible(true)}>
                            승인
                        </Button>
                    </View>
                </View>
            </ScrollView>

            {/* 승인 처리 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isApproveModalVisible}
                onRequestClose={() => setIsApproveModalVisible(false)}>
                {/* 배경 컨테이너에 양옆 패딩 40px 적용 */}
                <View className="flex-1 justify-center items-center bg-black/50 px-[40px]">
                    {/* 모달 박스에 w-full과 max-w-[430px] 적용 */}
                    <View className="bg-white w-full max-w-[430px] rounded-[20px] p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-purple-600">승인처리</Text>
                            <Pressable onPress={() => setIsApproveModalVisible(false)}>
                                <Feather name="x" size={24} color="#666" />
                            </Pressable>
                        </View>

                        <View className="items-center mb-8">
                            <Text className="text-lg font-bold mb-3">메모</Text>
                            <TextInput
                                className="w-full border border-gray-400 rounded-xl p-4 text-base text-gray-800"
                                style={{ minHeight: 100, textAlignVertical: "top" }}
                                multiline={true}
                                placeholder="승인 메모를 입력해주세요."
                                placeholderTextColor="#9ca3af"
                                value={memo}
                                onChangeText={setMemo}
                            />
                        </View>

                        <Button
                            className="h-[56px] bg-purple-500 rounded-xl"
                            textClassName="text-white text-lg font-bold"
                            onPress={handleApproveComplete}>
                            승인 완료
                        </Button>
                    </View>
                </View>
            </Modal>

            {/* 반려 처리 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isRejectModalVisible}
                onRequestClose={() => setIsRejectModalVisible(false)}>
                {/* 배경 컨테이너에 양옆 패딩 40px 적용 */}
                <View className="flex-1 justify-center items-center bg-black/50 px-[40px]">
                    {/* 모달 박스에 w-full과 max-w-[430px] 적용 */}
                    <View className="bg-white w-full max-w-[430px] rounded-[20px] p-6">
                        {/* 모달 헤더 */}
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-red-500">반려처리</Text>
                            <Pressable onPress={() => setIsRejectModalVisible(false)}>
                                <Feather name="x" size={24} color="#666" />
                            </Pressable>
                        </View>

                        {/* 메모 입력 */}
                        <View className="items-center mb-8">
                            <Text className="text-lg font-bold mb-3">메모</Text>
                            <TextInput
                                className="w-full border border-gray-400 rounded-xl p-4 text-base text-gray-800"
                                style={{ minHeight: 100, textAlignVertical: "top" }}
                                multiline={true}
                                placeholder="반려 사유를 입력해주세요."
                                placeholderTextColor="#9ca3af"
                                value={rejectMemo}
                                onChangeText={setRejectMemo}
                            />
                        </View>

                        {/* 반려 완료 버튼 */}
                        <Button
                            variant="outline"
                            className="h-[56px] rounded-xl border-red-500 bg-white border"
                            textClassName="text-red-500 text-lg font-bold"
                            onPress={handleRejectComplete}>
                            반려 완료
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
export default ManagerRentalRequestDetailPage;
