import { ScrollView } from "react-native";
import MainHeader from "@/components/layout/MainHeader";

function ManagerMainPage() {
    return (
        <ScrollView>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
            <View>
                <Text>안녕하세요</Text>
                <View>
                    <Text>김철수님</Text>
                    <Badge status={"오너"} />
                </View>
            </View>
        </ScrollView>
    );
}

export default ManagerMainPage;
