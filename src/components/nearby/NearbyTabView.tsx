import {ActionSheetIOS, Alert, Dimensions, Platform, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useState} from "react";
import {Route, TabView} from "react-native-tab-view";
import {BusStopWithBusesInfoProps} from "../../screens/NearbyScreen";
import axios from "axios";
import ScrollWithBusItems from "@components/nearby/ScrollWithBusItems";
import {busArrivingInfoUrl} from "@utils/UrlsUtil";
import * as Location from 'expo-location';
import {useNavigation} from "@react-navigation/native";
import CenteredMessage from "@components/shared/CenteredMessage";


// Define your initial state for the tab index and routes
const initialLayout = {width: Dimensions.get('window').width};
type FilterMode = 'all' | 'double';
const NearbyTabView = () => {
    const [busStops, setBusStops] = useState<BusStopWithBusesInfoProps[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);

    const [index, setIndex] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const getCurrentLocation = async () => {
        try {

            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Handle permission denied
                console.log("permission denied")
            }
            // longitude=103.9004605&latitude=1.403728
            // const { coords } = await Location.getCurrentPositionAsync();
            let latitude = 1.403728;
            let longitude = 103.9004605
            console.log("current location", latitude, longitude);
            console.log("getting current location");
            axios.get<BusStopWithBusesInfoProps[]>(busArrivingInfoUrl, {
                params: {
                    longitude: longitude,
                    latitude: latitude,
                    stopCount: 3,
                },
            }).then(({ data: busStops }) => {
                //passing the response.data to the busStop obj
                setBusStops(busStops);
                setLastUpdated(new Date());
                setRoutes(busStops.map((busStop, index) => ({
                    key: index.toString(),
                    title: busStop.busStopDescription
                })));
            });

            return {latitude, longitude};
        } catch (error) {
            // Handle error
            return null;
        }
    };
    // const busStops = MockBusStops
    useEffect(() => {
        getCurrentLocation()
    }, []);

    const currentStop = busStops[index];

    const showStopPicker = () => {
        if (!routes.length) {
            return;
        }
        const titles = routes.map((route) => route.title ?? 'Stop');

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    title: 'Select stop',
                    options: [...titles, 'Cancel'],
                    cancelButtonIndex: titles.length,
                },
                (buttonIndex) => {
                    if (buttonIndex < titles.length) {
                        setIndex(buttonIndex);
                    }
                }
            );
        } else {
            Alert.alert('Select stop', undefined, [
                ...titles.map((title, idx) => ({
                    text: title ?? 'Stop',
                    onPress: () => setIndex(idx),
                })),
                {text: 'Cancel', style: 'cancel'},
            ]);
        }
    };
    const formatTime = (date: Date | null) => {
        if (!date) return '--:--';
        return date.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'});
    };

    return (
        routes?.length > 0 ?
            <View className="flex-1 bg-slate-50">
                <View className="absolute -top-24 -right-12 w-64 h-64 rounded-full bg-amber-100 opacity-70"/>
                <View className="absolute top-24 -left-16 w-56 h-56 rounded-full bg-emerald-100 opacity-50"/>

                <View className="px-4" style={{paddingTop: insets.top}}>
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-3xl font-extrabold text-slate-900">Nearby</Text>
                            <Text className="mt-1 text-xs text-slate-500">
                                Updated: {formatTime(lastUpdated)} · {currentStop?.busStopRoadName ?? 'Location'}
                            </Text>
                        </View>
                        <View className="flex-row items-center space-x-2">
                            <TouchableOpacity
                                className="rounded-full bg-white px-3 py-2"
                                onPress={() => navigation.navigate('SearchScreen')}
                            >
                                <Text className="text-xs font-semibold text-slate-700">Search</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="rounded-full bg-white px-3 py-2"
                                onPress={() => setFilterMode((current) => current === 'all' ? 'double' : 'all')}
                            >
                                <Text className="text-xs font-semibold text-slate-700">
                                    Filter: {filterMode === 'all' ? 'All' : 'Double Deck'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-3">
                                <Text className="text-lg font-bold text-slate-900">
                                    {currentStop?.busStopDescription ?? 'Nearby stops'}
                                </Text>
                                <Text className="mt-1 text-xs text-slate-500">
                                    {currentStop?.busStopRoadName ?? 'Road'}
                                    {currentStop?.busStopCode ? ` · Stop Code ${currentStop.busStopCode}` : ''}
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="rounded-full bg-slate-900 px-3 py-2"
                                onPress={showStopPicker}
                            >
                                <Text className="text-xs font-semibold text-white">Change Stop</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="mt-2 text-[9px] text-slate-400">Swipe left or right to switch stops</Text>
                    </View>
                </View>

                <View className="flex-1">
                    <TabView
                        navigationState={{index, routes}}
                        renderScene={({route}) => {
                            const routeIndex = Number(route.key);
                            const busStopWithBusesInfo = busStops[routeIndex];
                            if (!busStopWithBusesInfo) {
                                return <CenteredMessage/>;
                            }
                            return (
                                <ScrollWithBusItems
                                    busStopWithBusesInfo={busStopWithBusesInfo}
                                    filterMode={filterMode}
                                />
                            );
                        }}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                        renderTabBar={() => null}
                    />
                </View>
            </View>
            : (
                <CenteredMessage/>
            )


    );
}
export default NearbyTabView;
