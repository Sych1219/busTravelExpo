import {Dimensions, StyleSheet, Text, View} from "react-native";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useState} from "react";
import {Route, SceneMap, TabBar, TabView} from "react-native-tab-view";
import {BusStopWithBusesInfoProps, RouteProps} from "../screens/NearbyScreen";
import axios from "axios";
import ScrollWithBusItems from "@components/ScrollWithBusItems";
import {busArrivingInfoUrl} from "@utils/UrlsUtil";


// Define your initial state for the tab index and routes
const initialLayout = {width: Dimensions.get('window').width};
const CustomerTabView = () => {
    const [busStops, setBusStops] = useState<BusStopWithBusesInfoProps[]>([]);

    const [routes, setRoutes] = useState<Route[]>([]);
    const [sceneMapProps, setSceneMapProps] = useState<{ [key: string]: React.ComponentType }>({});

    // const busStops = MockBusStops
    useEffect(() => {
        try {
            axios.get(busArrivingInfoUrl, {
                params: {
                    longitude: 103.9004605,
                    latitude: 1.4037280,
                    stopCount: 6,
                },
            }).then((response) => {
                //passing the response.data to the busStop obj
                const busStopsTemp = JSON.parse(JSON.stringify(response.data)) as BusStopWithBusesInfoProps[];
                setBusStops(busStopsTemp);

                const routesInitial: RouteProps[] = busStopsTemp.map((busStop, index) => ({
                    key: index.toString(),
                    title: busStop.busStopDescription
                }));
                setRoutes(routesInitial);
                const tempSceneMapProps: { [key: string]: React.ComponentType } = {};
                busStopsTemp.forEach((busStopWithBusesInfo, index) => {
                    tempSceneMapProps[index.toString()] = (() => (
                        <ScrollWithBusItems busStopWithBusesInfo={busStopWithBusesInfo}/>));
                });
                setSceneMapProps(tempSceneMapProps);
            });
        } catch (error) {
            console.log("error11", error);
        }
    }, []);

    const [index, setIndex] = useState(0);

    const insets = useSafeAreaInsets();
    const renderTabBar = (props: any) => (
        <TabBar {...props} activeColor={'black'} inactiveColor={'gray'} indicatorStyle={{backgroundColor: 'black'}}
                scrollEnabled={true}
            // labelStyle={{ flex: 1 }}
                renderLabel={({route, focused, color}) => (
                    <Text className={'font-extrabold text-lg'} numberOfLines={1} style={{color, width: '100%'}}>
                        {route.title}
                    </Text>
                )}
                style={[styles.tabBar, {paddingTop: insets.top}]}
        />
    );

    const handleIndexChange = (index: number) => {
        setIndex(index);
    };

    return (
        routes?.length > 0 && sceneMapProps && Object.keys(sceneMapProps).length > 0 ?
        <TabView
            navigationState={{index, routes}}
            renderScene={SceneMap(sceneMapProps)}
            onIndexChange={handleIndexChange}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
        /> : (<View><Text>Loading...</Text></View>)


    );
}
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
    },
});
export default CustomerTabView;
