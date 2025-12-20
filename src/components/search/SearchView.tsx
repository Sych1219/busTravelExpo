import {View, Text, SafeAreaView, TextInput, Button, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import {GOOGLE_API_KEY} from "@utils/Keys";
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from "react-native-google-places-autocomplete";
import BusRoutes from "@components/search/BusRoutes";
import {useRef, useState} from "react";
import BusAnimation from "@components/search/BusAnimation";
import TwoPointsWithCurve from "@components/search/TwoPointsWithCurve";
import {BusServiceNoAndBusRouteVOs, BusStopVO} from "@components/search/ListWalkAndStopsView";
import TestAnimationRestart from "@components/search/TestAnimationRestart";
import TestHookAndInterval from "@components/search/TestHookAndInterval";

const SearchView = () => {
    const [placeId, setPlaceId] = useState<string>("");
    //mock data of BusServiceNoAndBusRouteVOs
    const busStopVO1: BusStopVO = {
        distanceToUser: 1,
        busStopCode: "65221",
        roadName: "roadName",
        description: "block 271a Bef Tampines Ave 5",
        latitude: 1.1,
        longitude: 1.1,
    }
    const busServiceNoAndBusRouteVOs: BusServiceNoAndBusRouteVOs = {
        serviceNo: "123",
        busRouteVOs: [{
            id: "1",
            serviceNo: "34",
            operator: "SBST",
            direction: 1,
            stopSequence: 1,
            busStopCode: "65009",
            busStopVO: busStopVO1,
            distance: 1,
            wdFirstBus: "2021-08-01T20:00:00+08:00",
            wdLastBus: "2021-08-01T20:00:00+08:00",
            satFirstBus: "2021-08-01T20:00:00+08:00",
            satLastBus: "2021-08-01T20:00:00+08:00",
            sunFirstBus: "2021-08-01T20:00:00+08:00",
            sunLastBus: "2021-08-01T20:00:00+08:00",
        }, {
            id: "1",
            serviceNo: "34",
            operator: "SBST",
            direction: 1,
            stopSequence: 1,
            busStopCode: "65089",
            busStopVO: busStopVO1,
            distance: 1,
            wdFirstBus: "2021-08-01T20:00:00+08:00",
            wdLastBus: "2021-08-01T20:00:00+08:00",
            satFirstBus: "2021-08-01T20:00:00+08:00",
            satLastBus: "2021-08-01T20:00:00+08:00",
            sunFirstBus: "2021-08-01T20:00:00+08:00",
            sunLastBus: "2021-08-01T20:00:00+08:00",
        }, {
            id: "1",
            serviceNo: "34",
            operator: "SBST",
            direction: 1,
            stopSequence: 1,
            busStopCode: "65079",
            busStopVO: busStopVO1,
            distance: 1,
            wdFirstBus: "2021-08-01T20:00:00+08:00",
            wdLastBus: "2021-08-01T20:00:00+08:00",
            satFirstBus: "2021-08-01T20:00:00+08:00",
            satLastBus: "2021-08-01T20:00:00+08:00",
            sunFirstBus: "2021-08-01T20:00:00+08:00",
            sunLastBus: "2021-08-01T20:00:00+08:00",
        }],
        busArrivingInfo: {
            nextBus: {
                estimatedArrival: "2021-08-01T20:00:00+08:00",
                latitude: "1.1",
                longitude: "1.1",
                visitNumber: "1",
                load: "SEA",
                feature: "WAB",
                type: "SD",
                countDown: 50,
                originCode: "1",
                destinationCode: "2",
            },
            operator: "SBST",
            serviceNo: "34",
            toArriveBusStopCode: "65009",
        }
    }
    return (

        <SafeAreaView className={'w-full h-full flex-col justify-between'}>
            <View className={'w-full h-1/2'}>
                <GooglePlacesAutocomplete
                    styles={{
                        container: {
                            // paddingTop: 45,
                            paddingHorizontal: 32, // Add desired horizontal padding
                        },
                        textInputContainer: {
                            backgroundColor: 'white',
                            borderRadius: 10,
                            paddingHorizontal: 8, // Adjust horizontal padding as needed
                        },
                    }}
                    placeholder="search here"
                    onPress={(data, details) => {
                        // Handle selected place
                        if (data.place_id && data.place_id.length > 0) {
                            console.log("place id is set:", data.place_id);
                            setPlaceId(data.place_id);
                        }
                    }}
                    fetchDetails
                    query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                        components: 'country:sg'
                    }}
                />
            </View>

            <BusRoutes destinationPlaceId={placeId}/>
            {/*<BusAnimation/>*/}
            {/*<TwoPointsWithCurve busRouteVOs={busServiceNoAndBusRouteVOs.busRouteVOs}*/}
            {/*                    busArrivingInfo={busServiceNoAndBusRouteVOs.busArrivingInfo}*/}
            {/*                    serviceNo={busServiceNoAndBusRouteVOs.serviceNo}/>*/}
            {/*<TestHookAndInterval/>*/}
            {/*<TestAnimationRestart/>*/}

        </SafeAreaView>


    )
}

export default SearchView;