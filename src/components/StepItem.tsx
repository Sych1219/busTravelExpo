import {Text, TouchableOpacity, View} from "react-native";
import {FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import {Step} from "@components/BusRoutes";

interface StepItemProps {
    step: Step;
    index: number;
    showArrow: boolean;
    differentBusCodeCounts: number;
}

const StepItem = ({step, index, showArrow, differentBusCodeCounts}: StepItemProps) => {
    const lastIndex = differentBusCodeCounts - 1;
    //differentBusCodeCounts >= 5
    //in the  middle index won't show, just use the ... replace it
    console.log("differentBusCodeCounts:", differentBusCodeCounts, "index:", index, "lastIndex:", lastIndex, "differentBusCodeCounts/2:", differentBusCodeCounts/2)
    if (differentBusCodeCounts >= 5 && index === Math.round(differentBusCodeCounts/2))  {
        return (
            <Text>...</Text>
        )
    }
    return (
        <View className={'flex-row mr-2'}>
            {step.travelMode === "walking" && (
                <View className={'flex-row mr-1'}>
                    <FontAwesome5 name="walking" size={15} color="black"/>
                    {showArrow && (<MaterialIcons name={'keyboard-arrow-right'} size={15}/>)}
                </View>)}
            {step.travelMode === "transit" && (
                <View className={'flex-row mr-1'}>
                    <View className={'flex-row mr-2'}>
                        <View className="mr-3">
                            <FontAwesome5 name="bus" size={15} color="black"/>
                        </View>
                        <View className="bg-green-500 flex items-center pl-1 pr-1 ">
                            <Text className="font-black">{step.busCode}</Text>
                        </View>
                    </View>

                    {showArrow && (<MaterialIcons name={'keyboard-arrow-right'} size={15}/>)}
                </View>)}

        </View>
    )
};

export default StepItem;