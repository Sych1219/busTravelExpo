import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import NearbyScreen from "./src/screens/NearbyScreen";

import FavouriteScreen from "./src/screens/FavouriteScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HeartIcon, MapIcon, MagnifyingGlassIcon} from "react-native-heroicons/outline";
import SearchScreen from "./src/screens/SearchScreen";


type RootParamList = {
    FavouriteScreen: undefined
    NearbyScreen: undefined
    SearchScreen: undefined
    Screen3: { paramB: string; paramC: number }
    BusTravelOnTimeBar: undefined

}
export default function App() {
    const Tab = createBottomTabNavigator<RootParamList>();
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName={'NearbyScreen'}>
                <Tab.Screen name="NearbyScreen" component={NearbyScreen} options={{
                    title: 'Nearby',
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <MapIcon size={size} color={color}/>
                    ),
                    tabBarLabelPosition: 'beside-icon',
                }}/>
                <Tab.Screen name="FavouriteScreen" component={FavouriteScreen} options={{
                    title: 'Favourite',
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <HeartIcon size={size} color={color}/>
                    ),
                    tabBarLabelPosition: 'beside-icon',
                }}/>
                <Tab.Screen name="SearchScreen" component={SearchScreen} options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <MagnifyingGlassIcon size={size} color={color}/>
                    ),
                    tabBarLabelPosition: 'beside-icon',
                    unmountOnBlur: true,
                }}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
