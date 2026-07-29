import { ScrollView } from "react-native";
import MainHeader from "@/components/layout/MainHeader";

function ManagerMainPage() {
    return (
        <ScrollView>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
            ManagerMainPage
        </ScrollView>
    );
}

export default ManagerMainPage;
