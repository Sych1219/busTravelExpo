import {Image, Text, TouchableOpacity, View} from "react-native";
import Divider from "./Divider";
import {useEffect, useState} from "react";
import {formatCountdown, getBusType, getLoadColor} from "@utils/UtilsMethod";
import ArrvingInfoCard from "@components/ArrvingInfoCard";
import axios, {AxiosRequestConfig} from "axios";
import {busServiceUrl} from "@utils/UrlsUtil";


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

interface BusServiceParams  {
    busStopCode: string,
    serviceNo: string,
    deviceId: string,
}

const NearbyBusItem = ({
                     serviceNo,
                     operator,
                     nextBus,
                     nextBus2,
                     nextBus3
                 }: Service) => {

    const isWheelChairAccessible = nextBus.feature === 'WAB'
    const [service, setService] = useState<Service>();
    // const [countdown, setCountdown] = useState(nextBus.countDown);
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setCountdown(prevCountdown => prevCountdown - 1);
    //     }, 1000);
    //
    //     // Clean up the timer when the component unmounts
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []); // Empty dependency array ensures that the effect runs only once


    const getBusService = (busStopCode: string, busCode: string) => {
        const params: BusServiceParams = {
            busStopCode: busStopCode,
            serviceNo: busCode,
            deviceId: "1",
        }
        const config: AxiosRequestConfig = {
            params: params,
        };
        try {
            axios.get<Service>(busServiceUrl, config).then((response) => {
                setService(response.data);
            });
        } catch (error) {
            throw new Error('Failed to fetch data');
        }

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
                    <TouchableOpacity>
                        <ArrvingInfoCard nextBus={nextBus} nextBus2={nextBus2} nextBus3={nextBus3} />
                    </TouchableOpacity>

                </View>

            </View>
            <Divider color={'gray'} height={1}/>
        </View>

    )
}

export default NearbyBusItem;
