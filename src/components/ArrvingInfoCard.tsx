import {Text, TouchableOpacity, View} from "react-native";
import {NextBus} from "@components/NearbyBusItem";
import {formatCountdown, getLoadColor} from "@utils/UtilsMethod";
import React, {useEffect, useState} from "react";

export interface ArrvingInfoCardProps {
    nextBus: NextBus;
    nextBus2: NextBus;
    nextBus3: NextBus;
}

const ArrvingInfoCard = ({
                             nextBus,
                             nextBus2,
                             nextBus3,
                         }: ArrvingInfoCardProps) => {

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
        <View className="w-20 h-12 bg-black flex items-center justify-center rounded mx-1">

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

        </View>
    );
}

export default ArrvingInfoCard;
