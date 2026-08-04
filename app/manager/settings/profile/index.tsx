import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import MainHeader from "@/components/layout/MainHeader";
import Button from "@/components/common/Button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";

import { UpdateProfileInputType, updateProfileSchema } from "@/schemas/user/updateProfileSchema";

import userApi from "@/api/user/userApi";
import { useUserStore } from "@/stores/user/useUserStore";

function UpdateProfilePage() {
    const router = useRouter();

    const authUser = useUserStore(state => state.authUser);

    const updateUserInfo = useUserStore(state => state.updateUserInfo);

    const currentUser = authUser?.user;

    /*
     * 현재 이미지 URL입니다.
     *
     * 지금은 별도의 이미지 업로드 서버가 없으므로,
     * 기존에 DB에 저장된 URL만 표시합니다.
     */
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileInputType>({
        resolver: zodResolver(updateProfileSchema),
        mode: "onTouched",

        defaultValues: {
            name: "",
            imageUrl: undefined,
        },
    });

    /*
     * Zustand에서 사용자 정보를 불러온 뒤
     * 현재 이름과 이미지를 화면에 표시합니다.
     */
    useEffect(() => {
        if (!currentUser) {
            return;
        }

        reset({
            name: currentUser.name,
            imageUrl: currentUser.imageUrl ?? undefined,
        });

        setProfileImage(currentUser.imageUrl ?? null);
    }, [currentUser, reset]);

    const name = useWatch({
        control,
        name: "name",
    });

    const isFilled = Boolean(name?.trim());

    const onSubmit = async (data: UpdateProfileInputType) => {
        try {
            const updatedUser = await userApi.updateUser({
                name: data.name.trim(),
                ...(profileImage ? { imageUrl: profileImage } : {}),
            });

            // 수정된 사용자 정보를 Zustand에 반영
            updateUserInfo(updatedUser);

            // 웹에서는 Alert 확인 버튼 콜백이 정상적으로 작동하지 않을 수 있음
            if (Platform.OS === "web") {
                Alert.alert("수정 완료", "수정이 완료되었습니다.");

                // 알림을 닫은 뒤 이전 페이지로 이동
                router.back();
                return;
            }

            // 안드로이드와 iOS
            Alert.alert(
                "수정 완료",
                "수정이 완료되었습니다.",
                [
                    {
                        text: "확인",
                        onPress: () => router.back(),
                    },
                ],
                {
                    cancelable: false,
                },
            );
        } catch (error) {
            console.log("정보 수정 오류:", error);

            let errorMessage = "정보 수정 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message ?? errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", {
                message: errorMessage,
            });
        }
    };

    const handleImagePick = async () => {
        /*
         * 현재는 이미지 업로드 서버가 없으므로
         * 갤러리에서 선택한 파일을 서버에 저장할 수 없습니다.
         *
         * 나중에 이미지 업로드 API를 만든 후,
         * 서버가 반환한 URL을 다음처럼 넣으면 됩니다.
         *
         * setProfileImage(uploadedImageUrl);
         */
        Alert.alert("안내", "이미지 업로드 서버 연결 후 사용할 수 있습니다.");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper">
            <View className="flex-1">
                <MainHeader
                    title="정보수정"
                    isBackPress
                    onBackPress={() => {
                        router.navigate("/manager/my");
                    }}
                />

                <ScrollView className="flex-1" contentContainerClassName="flex-grow">
                    <View className="mx-5 mt-8">
                        {/* 프로필 이미지 */}
                        <View className="self-center mb-8">
                            <TouchableOpacity onPress={handleImagePick} activeOpacity={0.8}>
                                <View className="w-28 h-28 rounded-full bg-background-deep overflow-hidden items-center justify-center border border-gray-300">
                                    {profileImage ? (
                                        <Image
                                            source={{
                                                uri: profileImage,
                                            }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Feather name="user" size={48} color="#6B7280" />
                                    )}
                                </View>

                                <View className="absolute bottom-0 right-0 bg-secondary-main p-2 rounded-full items-center justify-center">
                                    <Feather size={24} name="edit-3" color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* 이름 */}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="이름"
                                    placeholder="변경할 이름을 입력해 주세요."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    infoMessage=""
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        {/* 이메일 */}
                        <InputGroup
                            label="이메일"
                            value={currentUser?.email ?? ""}
                            infoMessage="이메일은 변경할 수 없습니다."
                            editable={false}
                        />

                        {/* 서버 에러 */}
                        {errors.root?.message && (
                            <ErrorMessage className="self-center mt-2">
                                {errors.root.message}
                            </ErrorMessage>
                        )}

                        {/* 저장 버튼 */}
                        <Button
                            disabled={!isFilled}
                            isLoading={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className="h-[60px] mt-10 mb-10"
                            textClassName="text-2xl">
                            저장하기
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

export default UpdateProfilePage;
