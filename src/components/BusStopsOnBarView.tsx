import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {BusRouteVO, BusServiceNoAndBusRouteVOs} from "@components/ListWalkAndStopsView";

const BusStopsOnBarView = ({busRouteVOs, serviceNo}: BusServiceNoAndBusRouteVOs) => {
    const renderBusStopsBar = ({item, index}:{ item: BusRouteVO; index: number }) => (
        <View className={'w-full h-16 ml-3.5'}>
            <TouchableOpacity className={'flex-row items-center'}>
                <View className={'bg-blue-500 w-2 h-2 rounded-full'}/>
                <Text className={'text-black text-sm ml-2'}>{item.busStopVO.description}</Text>
            </TouchableOpacity>
            {busRouteVOs.length -1 !== index && <View className={'bg-gray-500 w-1 h-16  ml-0.5  absolute top-3.5'}/>}
        </View>
    );
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