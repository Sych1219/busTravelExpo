import {Image, Text, TouchableOpacity, View} from "react-native";
import Divider from "./Divider";
import {useEffect, useState} from "react";
import {formatCountdown, getBusType, getLoadColor} from "@utils/UtilsMethod";
import ArrvingInfoCard from "@components/ArrvingInfoCard";
import axios, {AxiosRequestConfig} from "axios";
import {busServiceUrl, clickOnFavouriteBus} from "@utils/UrlsUtil";


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

interface BusServiceParams {
    busStopCode: string,
    busCode: string,

}

interface NearbyBusItemProps {
    busStopCode: string;
    service: Service;
}

const NearbyBusItem = ({
                           busStopCode, service
                       }: NearbyBusItemProps) => {


    const [serviceInside, setServiceInside] = useState<Service>(service);
    const {nextBus, nextBus2, nextBus3, serviceNo}: Service = serviceInside;
    const isWheelChairAccessible = nextBus.feature === 'WAB'

    const [isRefreshing, setIsRefreshing] = useState(false);
    const updateBusService = (busStopCode: string, busCode: string) => {
        setIsRefreshing(true);
        const params: BusServiceParams = {
            busStopCode: busStopCode,
            busCode: busCode,
        }
        const busServiceUrlParameter: AxiosRequestConfig = {
            params: params,
        };
        const parmas2 = {
            deviceId: 123,
            busStopCode,
            busCode,
            longitude:103.9004605,
            latitude:1.4037280,
        }

        //here also need to call the be for faviourite bus
        axios.get(clickOnFavouriteBus, {params:parmas2}).then((response) => {
            console.log("click for faviourite", response.data)
        }).catch((error) => {
            console.log("click for faviourite got error", error)
        });


        axios.get<Service>(busServiceUrl, busServiceUrlParameter).then((response) => {
            console.log("updateBusService", response.data)
            setServiceInside(response.data);
            setIsRefreshing(false);
        }).catch((error) => {
            console.log("updateBusService", error)
            setIsRefreshing(false);
            throw new Error('Failed to fetch data');
        });


    }


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
                    <TouchableOpacity onPress={() => updateBusService(busStopCode, serviceNo)}>
                        <ArrvingInfoCard nextBus={nextBus} nextBus2={nextBus2} nextBus3={nextBus3}
                                         isRefreshing={isRefreshing}/>
                    </TouchableOpacity>

                </View>

            </View>
            <Divider color={'gray'} height={1}/>
        </View>

    )
}

export default NearbyBusItem;
