import React, {useRef} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import NearbyScreen from "./src/screens/NearbyScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FavouriteScreen from "./src/screens/FavouriteScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HeartIcon, MapIcon} from "react-native-heroicons/outline";
import MapView from "react-native-maps";
import {Marker} from "react-native-maps";
import {SafeAreaView, Text, TextInput, View} from 'react-native';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from "@utils/Keys";
import MapScreen from "./src/screens/MapScreen";
import SearchScreen from "./src/screens/SearchScreen";
import {BusTravelOnTimeBar} from "@components/BusTravelOnTimeBar";


type RootParamList = {
    FavouriteScreen: undefined
    NearbyScreen: undefined
    SearchScreen: undefined
    Screen3: { paramB: string; paramC: number }
    BusTravelOnTimeBar: undefined

}
export default function App() {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator<RootParamList>();
    const Root = createNativeStackNavigator<RootParamList>();

    const singaporeLatitude = 1.3521;
    const singaporeLongitude = 103.8198;
    const initialLatitudeDelta = 0.0922;
    const initialLongitudeDelta = 0.0421;
    const markerLatitude = 1.2897;
    const markerLongitude = 103.8501;

    console.log('API_KEY', GOOGLE_API_KEY);
    return (
        // <View>
        //     <MapView
        //         style={{flex: 1}}
        //         initialRegion={{
        //             latitude: 37.78825,
        //             longitude: -122.4324,
        //             latitudeDelta: 0.0922,
        //             longitudeDelta: 0.0421,
        //         }}
        //     />
        //
        // </View>
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName={'BusTravelOnTimeBar'}>
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
                        <HeartIcon size={size} color={color}/>
                    ),
                    tabBarLabelPosition: 'beside-icon',
                    unmountOnBlur: true,
                }}/>
                {/*    BusTravelOnTimeBar*/}
                <Tab.Screen name="BusTravelOnTimeBar" component={BusTravelOnTimeBar} options={{
                    title: 'BusTravelOnTimeBar',
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <HeartIcon size={size} color={color}/>
                    ),
                    tabBarLabelPosition: 'beside-icon',
                    unmountOnBlur: true,
                }}/>
            </Tab.Navigator>
        </NavigationContainer>

        // <SafeAreaView>
        //     <View className={'w-30 h-96 bg-amber-800'}>
        //         <GooglePlacesAutocomplete styles={{height: 20}}
        //             placeholder="dfd"
        //             onPress={(data, details = null) => {
        //                 // Handle selected place
        //                 console.log(data);
        //                 console.log(details);
        //             }}
        //             fetchDetails
        //             query={{
        //                 key: GOOGLE_API_KEY,
        //                 language: 'en',
        //             }}
        //         />
        //     </View>
        //
        //     <MapScreen/>
        //
        //
        // </SafeAreaView>
        // <MapView
        //     style={{ flex: 1 }}
        //     initialRegion={{
        //         latitude: 1.3521,
        //         longitude: 103.8198,
        //         latitudeDelta: 0.0922,
        //         longitudeDelta: 0.0421,
        //     }}
        // />
        // <MapScreen/>


    );
}

