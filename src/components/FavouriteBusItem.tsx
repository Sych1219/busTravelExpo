import {Image, Text, TouchableOpacity, View} from "react-native";
import Divider from "./Divider";
import {useEffect, useState} from "react";
import ArrvingInfoCard from "@components/ArrvingInfoCard";
import {getBusType, getLoadColor} from "@utils/UtilsMethod";


export interface Service {
    serviceNo: string;
    operator: string;
    nextBus: NextBus;
    nextBus2: NextBus;
    nextBus3: NextBus;
}

export interface NextBus {
    countDown: number;
    originCode: string;
    destinationCode: string;
    estimatedArrival: string;
    latitude: string;
    longitude: string;
    visitNumber: string;
    load: string;
    feature: string;
    type: string;

}

const FavouriteBusItem = ({
                              serviceNo,
                              operator,
                              nextBus,
                              nextBus2,
                              nextBus3
                          }: Service) => {


    const isWheelChairAccessible = nextBus.feature === 'WAB'

    return (
        <View className={'mt-1'}>
            <View className={'flex-row justify-between'}>
                <View className={'justify-center mx-2'}>
                    <Text className={'font-extrabold text-2xl'}>{serviceNo}</Text>
                </View>

                <View className={'flex-row space-x-2'}>
                    <View className="relative">
                        {getBusType(nextBus.type) != "" &&
                            <Text className={'w-25 h-5 '}>{getBusType(nextBus.type)}</Text>}
                        {isWheelChairAccessible &&
                            <Image className="w-5 h-5 absolute bottom-0 right-0"
                                   source={require('../assets/wheelchair.jpg')}/>}
                    </View>
                    <ArrvingInfoCard
                        nextBus={nextBus} nextBus2={nextBus2} nextBus3={nextBus3} isRefreshing={false}/>

                </View>

            </View>
            <Divider color={'gray'} height={1}/>
        </View>

    )
}

export default FavouriteBusItem;
