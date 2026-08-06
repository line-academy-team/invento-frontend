import React, { useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, TextInput, Pressable, Alert, Animated } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";

function ManagerDamageReportDetailPage() {
    const router = useRouter();

    const [isCompleted, setIsCompleted] = useState(false);

    const [isRentalInfoOpen, setIsRentalInfoOpen] = useState(false);
    const [rentalContentHeight, setRentalContentHeight] = useState(0);
    const rentalInfoHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isRentalInfoOpen) {
            Animated.timing(rentalInfoHeight, {
                toValue: rentalContentHeight,
                duration: 250,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(rentalInfoHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    }, [isRentalInfoOpen, rentalContentHeight]);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("분실");
    const categories = ["분실", "고장", "부족", "초과", "기타"];
    const [dropdownContentHeight, setDropdownContentHeight] = useState(0);
    const dropdownHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isCategoryDropdownOpen) {
            Animated.timing(dropdownHeight, {
                toValue: dropdownContentHeight,
                duration: 250,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(dropdownHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    }, [isCategoryDropdownOpen, dropdownContentHeight]);

    const [replyContent, setReplyContent] = useState(
        "네, 확인했습니다. 새로운 기기로 교체해 드리겠습니다.",
    );

    const handleConfirm = () => {
        Alert.alert("확인", "처리가 완료되었습니다.", [
            {
                text: "확인",
                onPress: () => {
                    setIsCompleted(true);
                },
            },
        ]);
    };

    return (
        <View className={"flex-1 bg-white"}>
            <MainHeader
                title={"파손신고 상세"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/report");
                }}
            />

            {/* 수정해야 하는 곳 */}
            {/*<Pressable*/}
            {/*    onPress={() => setIsCompleted(!isCompleted)}*/}
            {/*    className="bg-gray-800 p-2 items-center">*/}
            {/*    <Text className="text-white text-sm">*/}
            {/*        🔄 화면 상태 변경 테스트 (현재: {isCompleted ? "완료" : "대기"})*/}
            {/*    </Text>*/}
            {/*</Pressable>*/}

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] pt-1 pb-8 flex-1"}>
                    <View className={"flex-1"}>
                        <View className={"border-b border-gray-200 py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["pb-3 mb-2 border-b border-gray-300"],
                                    ["flex-row justify-between items-center"],
                                )}>
                                <Text className={"text-lg font-bold"}>파손 정보</Text>

                               <Badge status={isCompleted ? "답변완료" : "답변대기"} />
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-2",
                                    "items-center",
                                ])}>
                                <Text className={"text-gray-500 text-base font-semibold"}>
                                    신청일시
                                </Text>
                                <Text className={"text-gray-800 text-base"}>2026.07.25 14:30</Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-2",
                                    "items-center",
                                ])}>
                                <Text className={"text-gray-500 text-base font-semibold"}>
                                    신청자
                                </Text>
                                <Text className={"text-gray-800 text-base"}>
                                    김행사 대리 (010-1234-5678)
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-2",
                                    "items-center",
                                ])}>
                                <Text className={"text-gray-500 text-base font-semibold"}>
                                    소속
                                </Text>
                                <Text className={"text-gray-800 text-base"}>마케팅 / 사원</Text>
                            </View>
                        </View>

                        <View className={"py-3"}>
                            <Text className={"pb-3 text-lg font-bold"}>파손사유</Text>
                            <View className={"bg-gray-100 rounded-2xl p-5 mb-3"}>
                                <Text className={"text-gray-800 text-base leading-6"}>
                                    노트북 전원은 들어오는데 화면이{"\n"}보이지 않습니다.
                                </Text>
                            </View>
                        </View>
                        <View className={"py-3"}>
                            <Text className={"pb-3 text-lg font-bold"}>장비 정보</Text>
                            <View
                                className={twMerge(
                                    ["bg-purple-50", "rounded-2xl", "p-5", "mb-5"],
                                    ["flex-row", "items-center"],
                                )}>
                                <View
                                    className={
                                        "bg-white p-3 rounded-lg mr-4 border border-gray-200"
                                    }>
                                    <Feather
                                        name={"monitor"}
                                        size={32}
                                        className={"text-blue-500"}
                                        color="#3b82f6"
                                    />
                                </View>
                                <View>
                                    <Text
                                        className={twMerge([
                                            "text-gray-800",
                                            "text-lg",
                                            "font-bold",
                                        ])}>
                                        노트북01
                                    </Text>
                                    <Text className={"py-1 text-sm text-gray-500 font-medium"}>
                                        IT 기기 / 노트북
                                    </Text>
                                    <Text className={"text-sm text-gray-500 font-medium"}>
                                        수량 2
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className={"border border-gray-200 rounded-2xl mb-6 overflow-hidden"}>
                            <Pressable
                                className={
                                    "flex-row justify-between items-center p-5 bg-white z-10"
                                }
                                onPress={() => setIsRentalInfoOpen(!isRentalInfoOpen)}>
                                <Text className={"text-lg font-bold text-gray-800"}>
                                    대여정보 확인
                                </Text>
                                <Feather
                                    name={isRentalInfoOpen ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#333"
                                />
                            </Pressable>

                            <Animated.View style={{ height: rentalInfoHeight, overflow: "hidden" }}>
                                <View
                                    className={"absolute top-0 w-full"}
                                    onLayout={e =>
                                        setRentalContentHeight(e.nativeEvent.layout.height)
                                    }>
                                    <View className={"px-5 pb-5 bg-white"}>
                                        <View className={"h-[1px] bg-gray-200 w-full mb-4"} />
                                        <View
                                            className={
                                                "flex-row justify-between py-2 items-center"
                                            }>
                                            <Text className={"text-gray-500 text-sm font-semibold"}>
                                                신청일시
                                            </Text>
                                            <Text className={"text-gray-800 text-sm"}>
                                                2026.07.22 14:30
                                            </Text>
                                        </View>
                                        <View
                                            className={
                                                "flex-row justify-between py-2 items-center"
                                            }>
                                            <Text className={"text-gray-500 text-sm font-semibold"}>
                                                대여기간
                                            </Text>
                                            <Text className={"text-gray-800 text-sm"}>
                                                2026.07.20 ~ 2026.07.28
                                            </Text>
                                        </View>
                                        <View
                                            className={
                                                "flex-row justify-between py-2 items-center"
                                            }>
                                            <Text className={"text-gray-500 text-sm font-semibold"}>
                                                사용목적
                                            </Text>
                                            <Text className={"text-gray-800 text-sm"}>
                                                코엑스 행사 준비
                                            </Text>
                                        </View>
                                        <View className={"flex-row justify-between py-2 mt-1"}>
                                            <Text
                                                className={
                                                    "text-gray-500 text-sm font-semibold w-1/4"
                                                }>
                                                추가 메모
                                            </Text>
                                            <Text
                                                className={
                                                    "text-gray-800 text-sm w-3/4 text-right leading-5"
                                                }>
                                                노트북 거치대도 함께 대여요청{"\n"}드립니다.
                                            </Text>
                                        </View>

                                        <View className={"bg-gray-100 rounded-xl p-4 mt-4"}>
                                            <Text
                                                className={
                                                    "text-gray-600 text-sm font-semibold mb-1"
                                                }>
                                                예상 반납일
                                            </Text>
                                            <Text className={"text-gray-800 text-base font-medium"}>
                                                2026.07.30(목)
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>
                        </View>

                        <View className={"py-3 mb-6"}>
                            {isCompleted ? (
                                <View>
                                    <Text className={"pb-3 text-lg font-bold"}>관리자 답변</Text>
                                    <View className={"bg-purple-50 rounded-2xl p-5"}>
                                        <View className={"flex-row items-center mb-3"}>
                                            <Text
                                                className={
                                                    "text-purple-600 font-bold mr-2 border border-purple-200 px-2 py-1 rounded-md text-xs bg-white"
                                                }>
                                                {selectedCategory || "선택 안됨"}
                                            </Text>
                                        </View>
                                        <Text className={"text-gray-800 text-base leading-6"}>
                                            {replyContent || "답변 내용이 없습니다."}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text className={"pb-3 text-lg font-bold"}>파손 종류</Text>
                                    <View className={"mb-4"}>
                                        <Pressable
                                            className={
                                                "flex-row justify-between items-center border border-gray-300 rounded-xl p-4 bg-white"
                                            }
                                            onPress={() =>
                                                setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                                            }>
                                            <Text
                                                className={
                                                    selectedCategory
                                                        ? "text-gray-800"
                                                        : "text-gray-800 font-medium"
                                                }>
                                                {selectedCategory || "답변분류 선택"}
                                            </Text>
                                            <Feather
                                                name={
                                                    isCategoryDropdownOpen
                                                        ? "chevron-up"
                                                        : "chevron-down"
                                                }
                                                size={20}
                                                color="#333"
                                            />
                                        </Pressable>

                                        <Animated.View
                                            style={{ height: dropdownHeight, overflow: "hidden" }}>
                                            <View
                                                className={"absolute top-0 w-full"}
                                                onLayout={e =>
                                                    setDropdownContentHeight(
                                                        e.nativeEvent.layout.height,
                                                    )
                                                }>
                                                <View
                                                    className={
                                                        "mt-1 border border-gray-300 rounded-xl bg-white overflow-hidden"
                                                    }>
                                                    {categories.map((item, index) => (
                                                        <Pressable
                                                            key={index}
                                                            className={`p-4 border-b border-gray-100 ${selectedCategory === item ? "bg-purple-500" : "bg-white"}`}
                                                            onPress={() => {
                                                                setSelectedCategory(item);
                                                                setIsCategoryDropdownOpen(false);
                                                            }}>
                                                            <Text
                                                                className={`${selectedCategory === item ? "text-white font-bold" : "text-gray-800"}`}>
                                                                {item}
                                                            </Text>
                                                        </Pressable>
                                                    ))}
                                                </View>
                                            </View>
                                        </Animated.View>
                                    </View>

                                    <View className={"mt-2"}>
                                        <Text className={"pb-3 text-lg font-bold"}>답변</Text>
                                        <TextInput
                                            className={
                                                "w-full border border-gray-300 rounded-xl p-4 text-base text-gray-800 bg-white"
                                            }
                                            style={{ minHeight: 120, textAlignVertical: "top" }}
                                            multiline={true}
                                            placeholder="답변내용을 적어주세요"
                                            placeholderTextColor="#9ca3af"
                                            value={replyContent}
                                            onChangeText={setReplyContent}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {!isCompleted && (
                        <View className={"pt-4"}>
                            <Button
                                className={"h-[60px] w-full bg-purple-600 rounded-xl"}
                                textClassName={"text-xl text-white font-bold"}
                                onPress={handleConfirm}>
                                확인
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default ManagerDamageReportDetailPage;
