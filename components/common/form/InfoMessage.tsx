import { View, Text } from "react-native";

interface InfoMessageProps {
    children: string;
}

function InfoMessage({ children }: InfoMessageProps) {
    return (
        <View className={"mt-1.5"}>
            <Text className={"text-brand-txt-light text-sm font-pretendard-medium"}>
                {children}
            </Text>
        </View>
    );
}

export default InfoMessage;
