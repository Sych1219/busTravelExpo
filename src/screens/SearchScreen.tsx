import SearchView from "@components/search/SearchView";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RouteView from "@components/search/RouteView";
import {Leg} from "@components/search/BusRoutes";
import RouteResultsView from "@components/search/RouteResultsView";

export type StackParamList = {
    SearchView: undefined;
    RouteView: Leg;
    RouteResultsView: { destinationPlaceId: string; destinationDescription?: string };
};
const SearchScreen = () => {

    const Stack = createNativeStackNavigator<StackParamList>();
    return (
        <Stack.Navigator>
            <Stack.Screen name="SearchView" component={SearchView}
                          options={{presentation: 'modal', headerShown: false}}/>
            <Stack.Screen
                name="RouteResultsView"
                component={RouteResultsView}
                options={({route}) => ({headerShown: true, title: route.params?.destinationDescription ?? ""})}
            />
            <Stack.Screen name="RouteView" component={RouteView} options={{headerShown: true, title: ""}}/>
        </Stack.Navigator>
        // <SearchView/>
    );
}

export default SearchScreen;
