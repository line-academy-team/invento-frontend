import { ScrollView } from "react-native";
import MainHeader from "@/components/layout/MainHeader";

function UserMainPage() {
    return (
        <ScrollView>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
            UserMainPage
        </ScrollView>
    );
}

export default UserMainPage;
