import { ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";

function UserMainPage() {
    return (
        <ScrollView>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
        </ScrollView>
    );
}

export default UserMainPage;
