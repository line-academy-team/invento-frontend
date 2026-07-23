import { View, Text } from "react-native";

interface ErrorMessageProps {
    children: string;
}

function ErrorMessage({ children }: ErrorMessageProps) {
    return (
        <View className={"mt-1.5"}>
            <Text className={"text-brand-danger text-sm font-pretendard-medium"}>{children}</Text>
        </View>
    );
}

export default ErrorMessage;
