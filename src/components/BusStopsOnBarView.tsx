import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {BusRouteVO, BusServiceNoAndBusRouteVOs} from "@components/ListWalkAndStopsView";
import {NextBus} from "@components/NearbyBusItem";
import {formatCountdown} from "@utils/UtilsMethod";
import React from "react";

const BusStopsOnBarView = ({busRouteVOs, serviceNo, busArrivingInfo}: BusServiceNoAndBusRouteVOs) => {
    console.log("busRouteVOs is ", busRouteVOs)
    const styleStirng = 'text-red-800 text-sm ml-2'
    const indexToChose = busRouteVOs.findIndex((busRouteVO: BusRouteVO) => {
        return busRouteVO.busStopVO.busStopCode === busArrivingInfo.toArriveBusStopCode
    });
    console.log("indexBefore is ", indexToChose)
    const renderBusStopsBar = ({item, index}: { item: BusRouteVO; index: number }) => {
        const testStyle =
            item.busStopVO.busStopCode === busArrivingInfo.toArriveBusStopCode ?
                'text-red-800 text-sm ml-2' : 'text-black text-sm ml-2'

        return (
            <View className={'w-full h-16 ml-3.5'} key={index}>
                <TouchableOpacity className={'flex-row items-center'}>
                    <View className={'bg-blue-500 w-2 h-2 rounded-full'}/>
                    {indexToChose ===index&&  <View className="w-20 h-12 bg-black flex items-center justify-center rounded mx-1">
                        <Text
                            className={`text-center text-white text-xl font-extrabold `}>{formatCountdown(260)}</Text>

                    </View>}
                    <Text
                        className={testStyle}>
                        {item.busStopVO.description}
                    </Text>
                </TouchableOpacity>
                {busRouteVOs.length - 1 !== index &&
                    <View className={'bg-gray-500 w-1 h-16  ml-0.5  absolute top-3.5'}/>}
            </View>
        )
    };
    return (
        <View>
            <Text>{serviceNo}</Text>
            <FlatList
                data={busRouteVOs}
                renderItem={renderBusStopsBar}
            />
        </View>
    )
}

export default BusStopsOnBarView;