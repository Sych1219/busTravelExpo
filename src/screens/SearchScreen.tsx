import {View, Text, SafeAreaView} from "react-native";
import SearchBar from "@components/SearchBar";
import BusRoutes from "@components/BusRoutes";

const SearchScreen = () => {
    return (
        <SafeAreaView>
            {/*search bar*/}
            <SearchBar/>
        </SafeAreaView>
    );
}

export default SearchScreen;