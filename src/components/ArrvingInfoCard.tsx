import {Text, TouchableOpacity, View} from "react-native";
import {NextBus} from "@components/NearbyBusItem";
import {formatCountdown} from "@utils/UtilsMethod";
import React from "react";

export interface ArrvingInfoCardProps {
    loadColor: string;
    loadColor2: string;
    loadColor3: string;
    countdown: number;
    nextBus2: NextBus;
    nextBus3: NextBus;

    onPressFunction?: () => void;
}

const ArrvingInfoCard = ({
                             loadColor,
                             loadColor2,
                             loadColor3,
                             nextBus2,
                             nextBus3,
                             countdown,
                             onPressFunction
                         }: ArrvingInfoCardProps) => {
    return (
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
    );
}

export default ArrvingInfoCard;
