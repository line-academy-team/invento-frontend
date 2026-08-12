import { UpdateProfileInputType, updateProfileSchema } from "@/schemas/user/updateProfileSchema";
import { useUserStore } from "@/stores/user/useUserStore";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userApi from "@/api/user/userApi";
import { Alert, Platform, ScrollView, TouchableOpacity, View, Image } from "react-native";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/Button/Button";

interface ProfileFormProps {
    onSuccess: () => void; // 완료 후 부모(라우트)에게 알림
}

function ProfileForm({ onSuccess }: ProfileFormProps) {
    const authUser = useUserStore(state => state.authUser);
    const updateUserInfo = useUserStore(state => state.updateUserInfo);
    const currentUser = authUser?.user;

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
        defaultValues: { name: "", imageUrl: undefined },
    });

    useEffect(() => {
        if (!currentUser) return;
        reset({
            name: currentUser.name,
            imageUrl: currentUser.imageUrl ?? undefined,
        });
        setProfileImage(currentUser.imageUrl ?? null);
    }, [currentUser, reset]);

    const name = useWatch({ control, name: "name" });
    const isFilled = Boolean(name?.trim());

    const onSubmit = async (data: UpdateProfileInputType) => {
        try {
            const updatedUser = await userApi.updateUser({
                name: data.name.trim(),
                ...(profileImage ? { imageUrl: profileImage } : {}),
            });
            updateUserInfo(updatedUser);

            if (Platform.OS === "web") {
                Alert.alert("수정 완료", "수정이 완료되었습니다.");
                onSuccess(); // 라우트 페이지에서 넘겨준 뒤로 가기 실행
                return;
            }

            Alert.alert(
                "수정 완료",
                "수정이 완료되었습니다.",
                [{ text: "확인", onPress: onSuccess }],
                { cancelable: false },
            );
        } catch (error) {
            let errorMessage = "정보 수정 중 오류가 발생했습니다.";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message ?? errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError("root", { message: errorMessage });
        }
    };

    const handleImagePick = async () => {
        Alert.alert("안내", "이미지 업로드 서버 연결 후 사용할 수 있습니다.");
    };

    // @ts-ignore
    return (
        <ScrollView className="flex-1" contentContainerClassName="flex-grow">
            <View className="mx-5 mt-8">
                <View className="self-center mb-8">
                    <TouchableOpacity onPress={handleImagePick} activeOpacity={0.8}>
                        <View className="w-28 h-28 rounded-full bg-background-deep overflow-hidden items-center justify-center border border-gray-300">
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
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
                            errorMessage={errors.name?.message}
                        />
                    )}
                />

                <InputGroup
                    label="이메일"
                    value={currentUser?.email ?? ""}
                    infoMessage="이메일은 변경할 수 없습니다."
                    editable={false}
                />

                {errors.root?.message && (
                    <ErrorMessage className="self-center mt-2">{errors.root.message}</ErrorMessage>
                )}

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
    );
}

export default ProfileForm;
