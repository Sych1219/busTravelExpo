import SearchView from "@components/SearchView";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StepItem from "@components/StepItem";
import RouteView from "@components/RouteView";
import {Leg} from "@components/BusRoutes";
export type StackParamList = {
    SearchView: undefined;
    RouteView: Leg;
};
const SearchScreen = () => {

    const Stack = createNativeStackNavigator<StackParamList>();
    return (
            <Stack.Navigator>
                <Stack.Screen name="SearchView" component={SearchView} options={{presentation: 'modal', headerShown: false}}/>
                <Stack.Screen name="RouteView" component={RouteView} />
            </Stack.Navigator>
        // <SearchView/>
    );
}

export default SearchScreen;