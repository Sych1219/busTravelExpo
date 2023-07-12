import {Text, TouchableOpacity, View} from "react-native";
import {FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import {Step} from "@components/BusRoutes";

interface StepItemProps {
    step: Step;
    index: number;
    showArrow: boolean;
}

const StepItem = ({step, index, showArrow}: StepItemProps) => {
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
                        <Text className={'bg-green-500 font-black'}>{step.busCode} </Text>
                    </View>

                    {showArrow && (<MaterialIcons name={'keyboard-arrow-right'} size={15}/>)}
                </View>)}

        </View>
    )
};

export default StepItem;