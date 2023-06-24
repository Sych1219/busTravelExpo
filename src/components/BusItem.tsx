import {Image, Text, TouchableOpacity, View} from "react-native";
import Divider from "./Divider";
import {useEffect, useState} from "react";


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

export enum BusType {//SD (for Single Deck), DD (for Double Deck),  BD (for Bendy)
    SD = 'Single Deck',
    DD = 'Double Deck',
    BD = 'BD',
}

export enum LoadType {//SEA (for Seats Available) or LSD (for Limited Standing) or SDA (for Standing Available)
    SEA = 'Seats Available',
    LSD = 'Limited Standing',
    SDA = 'Standing Available',
}

//input is LoadType output is color string
const getLoadColor = (load: string): string => {
    switch (load) {
        case 'SEA':
            return 'text-green-500';
        case "SDA":
            return 'text-yellow-500';
        case "LSD":
            return 'text-red-500';
    }
    return 'text-green-500';
}

function formatCountdown(countdown: number): string {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    if (minutes < 1) {
        return "Arr";
    }

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function getBusType(busType: string): string {
    switch (busType) {
        case 'SD':
            return "single deck";
        case 'DD':
            return "double deck";
        case 'BD':
            return "bendy";
    }
    return "";
}

const BusItem = ({
                     serviceNo,
                     operator,
                     nextBus,
                     nextBus2,
                     nextBus3
                 }: Service) => {

    const loadColor = getLoadColor(nextBus.load)
    const loadColor2 = getLoadColor(nextBus2.load)
    const loadColor3 = getLoadColor(nextBus3.load)
    const isWheelChairAccessible = nextBus.feature === 'WAB'

    const [countdown, setCountdown] = useState(nextBus.countDown);
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        // Clean up the timer when the component unmounts
        return () => {
            clearInterval(timer);
        };
    }, []); // Empty dependency array ensures that the effect runs only once
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
                    <TouchableOpacity className="w-20 h-12 bg-black flex items-center justify-center rounded mx-1">

                        <View className="flex-row absolute bottom-0 right-1 ">
                            <Text
                                className={`text-xs text-white ${loadColor2}`}>{Math.floor(nextBus2.countDown / 60)}, </Text>
                            <Text
                                className={`text-xs text-white ${loadColor3}`}>{Math.floor(nextBus3.countDown / 60)}</Text>
                        </View>
                        {/*base on the load will get green yellow red for text*/}
                        <Text
                            className={`text-center text-white text-xl font-extrabold ${loadColor}`}>{formatCountdown(countdown)}</Text>
                        {/*<Text className={`text-center text-white text-xl font-extrabold ${loadColor}`}>{Math.floor(nextBus.countDown/60)}</Text>*/}

                    </TouchableOpacity>
                </View>

            </View>
            <Divider color={'gray'} height={1}/>
        </View>

    )
}

export default BusItem;
