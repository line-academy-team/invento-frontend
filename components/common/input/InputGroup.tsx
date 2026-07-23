import { Image, Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import InfoMessage from "@/components/common/form/InfoMessage";
import { twMerge } from "tailwind-merge";
import { router } from "expo-router";
import { useState } from "react";

interface InputGroupProps extends TextInputProps {
    label: string;
    infoMessage: string;
    errorMessage?: string;
    isPassword?: boolean;
}

function InputGroup({
                        label,
                        id,
                        infoMessage,
                        errorMessage,
                        isPassword = false,
                        ...props
                    }: InputGroupProps) {
    const [visibility, setVisibility] = useState(false);

    return (
        <View className="mt-5">
            <Text className={"text-brand-txt-main font-pretendard-semibold text-sm"}>{label}</Text>
            <TextInput
                className={twMerge(
                    "mt-3 p-3 relative font-pretendard",
                    "bg-brand-surface rounded-xl border border-brand-border",
                    "focus:bg-brand-bg focus:outline-brand-primary focus:border-2",
                    errorMessage && "border-brand-danger border-2",
                )}
                placeholder={"4자 이상 입력해주세요"}
                secureTextEntry={isPassword && !visibility}
                {...props}
            />
            {isPassword && (
                <Pressable
                    className={twMerge("h-5 w-5 absolute", "right-4 top-11")}
                    onPress={() => {
                        setVisibility(!visibility);
                    }}>
                    <Image
                        source={
                            visibility
                                ? require("@/assets/images/register/visibility_off.png")
                                : require("@/assets/images/register/visibility.png")
                        }
                        resizeMode="contain"
                        style={{ width: 20, height: 20 }}
                    />
                </Pressable>
            )}
            {errorMessage ? (
                <ErrorMessage>{errorMessage}</ErrorMessage>
            ) : (
                <InfoMessage>{infoMessage}</InfoMessage>
            )}
        </View>
    );
}

export default InputGroup;
