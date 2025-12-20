import {ScrollView, Text, View} from "react-native";
import {BusStopWithBusesInfoProps} from "../../screens/NearbyScreen";
import NearbyBusItem from "@components/shared/NearbyBusItem";

type FilterMode = 'all' | 'double';
type ScrollWithBusItemsProps = {
    busStopWithBusesInfo: BusStopWithBusesInfoProps;
    contentPaddingBottom?: number;
    filterMode?: FilterMode;
}
const ScrollWithBusItems = ({busStopWithBusesInfo, contentPaddingBottom, filterMode = 'all'}: ScrollWithBusItemsProps) => {
    const busStopCode = busStopWithBusesInfo.busStopCode;
    const filteredServices = filterMode === 'double'
        ? busStopWithBusesInfo.services.filter((service) => service.nextBus?.type === 'DD')
        : busStopWithBusesInfo.services;
    const sortedServices = [...filteredServices].sort((a, b) => {
        const aEta = a.nextBus?.countDown ?? Number.POSITIVE_INFINITY;
        const bEta = b.nextBus?.countDown ?? Number.POSITIVE_INFINITY;
        return aEta - bEta;
    });
    const pinnedServices = sortedServices.slice(0, 2);
    const restServices = sortedServices.slice(2);
    return (
        <ScrollView
            contentContainerStyle={{
                paddingBottom: contentPaddingBottom ?? 0,
                paddingHorizontal: 16,
                paddingTop: 12,
            }}
        >
            <View className="mb-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Favorites
                </Text>
                <View className="mt-3 space-y-3">
                    {pinnedServices.length > 0 ? pinnedServices.map((service) => (
                        <NearbyBusItem
                            key={service.serviceNo}
                            service={service}
                            busStopCode={busStopCode}
                            variant="pinned"
                        />
                    )) : (
                        <Text className="mt-2 text-sm text-slate-400">No pinned services yet.</Text>
                    )}
                </View>
            </View>

            <View className="mb-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    All Routes
                </Text>
                <View className="mt-3 space-y-3">
                    {restServices.length > 0 ? restServices.map((service) => (
                        <NearbyBusItem
                            key={service.serviceNo}
                            service={service}
                            busStopCode={busStopCode}
                        />
                    )) : (
                        <Text className="mt-2 text-sm text-slate-400">No services available.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

export default ScrollWithBusItems;
