import {Image, Modal, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import axios from "axios";
import Constants from "expo-constants";
import {MaterialIcons} from "@expo/vector-icons";
import {clickOnAddToFavoritesButtonUrl} from "@utils/UrlsUtil";


export interface Service {
    serviceNo: string;
    operator?: string;
    nextBus: NextBus | null;
    nextBus2?: NextBus | null;
    nextBus3?: NextBus | null;
}

export interface NextBus {
    countDown: number;
    estimatedArrival?: string;
    latitude?: string;
    longitude?: string;
    visitNumber?: string;
    load?: string;
    feature?: string;
    type?: string;
    originCode?: string;
    destinationCode?: string;
}

export interface BusServiceParams {
    busStopCode: string,
    busCode: string,

}

interface NearbyBusItemProps {
    busStopCode: string;
    service: Service;
    variant?: 'pinned' | 'default';
    disableAutoRefresh?: boolean;
}

const NearbyBusItem = ({
                           busStopCode, service, variant = 'default', disableAutoRefresh = false
                       }: NearbyBusItemProps) => {

    const [serviceInside, setServiceInside] = useState<Service>(service);
    const nextBus = serviceInside.nextBus;
    const nextBus2 = serviceInside.nextBus2 ?? null;
    const nextBus3 = serviceInside.nextBus3 ?? null;
    const serviceNo = serviceInside.serviceNo;
    const isWheelChairAccessible = nextBus?.feature === 'WAB'
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isSavingFavourite, setIsSavingFavourite] = useState(false);

    const formatEta = (countDown: number | null) => {
        if (countDown === null || countDown === undefined) {
            return 'No Est';
        }
        if (countDown < 60) {
            return 'Arr';
        }
        const minutes = Math.floor(countDown / 60);
        return `${minutes} min`;
    };

    const getEtaTone = (countDown: number | null) => {
        if (countDown === null || countDown === undefined) {
            return 'bg-slate-200 text-slate-700';
        }
        if (countDown < 120) {
            return 'bg-emerald-500 text-white';
        }
        if (countDown < 600) {
            return 'bg-amber-500 text-white';
        }
        return 'bg-slate-200 text-slate-700';
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {hour12: false});
    };

    const getNextLine = () => {
        const extras = [nextBus2, nextBus3]
            .map((bus) => formatEta(bus?.countDown ?? null))
            .filter((value) => value !== 'No Est');
        if (extras.length === 0) {
            return 'No additional arrivals yet';
        }
        return extras.join(', ');
    };

    const handleAddToFavourites = async () => {
        const deviceId = Constants.deviceId ?? 666;
        console.log("deviceId, busStopCode, serviceNo", deviceId, busStopCode, serviceNo);
        try {
            setIsSavingFavourite(true);
            await axios.post(clickOnAddToFavoritesButtonUrl, null, {
                params: {
                    deviceId,
                    busStopCode,
                    serviceNo,
                },
            });
        } catch (error) {
            console.log('Failed to save favourite', error);
        } finally {
            setIsSavingFavourite(false);
        }
    };

    return (
        <View className="mb-3">
            <View
                className={`rounded-2xl border ${
                    variant === 'pinned' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
                }`}
            >
                <View className="px-4 py-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center space-x-3">
                            <Text className="text-2xl font-extrabold text-slate-900">{serviceNo}</Text>
                        <View className="flex-row items-center space-x-2">
                            {isWheelChairAccessible && (
                                <View>
                                    <Image
                                        source={require('../../assets/wheelchair.jpg')}
                                            className="h-4 w-4"
                                            resizeMode="contain"
                                        />
                                    </View>
                                )}
                                {nextBus?.type === 'DD' && (
                                    <View className="rounded-full bg-slate-100 px-2 py-0.5">
                                        <Text className="text-xs font-semibold text-slate-700">DD</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View className={`rounded-full px-3 py-2 ${getEtaTone(nextBus?.countDown ?? null)}`}>
                            <Text className="text-xs font-semibold">
                                {isRefreshing ? '...' : formatEta(nextBus?.countDown ?? null)}
                            </Text>
                        </View>
                    </View>

                    <Text className="mt-1 text-xs text-slate-500">
                        Next: {getNextLine()}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-500">
                        To: {nextBus?.destinationCode ?? '--'}
                    </Text>

                    <View className="mt-3 flex-row items-center space-x-2">
                        <TouchableOpacity className="flex-1 rounded-full bg-slate-900 px-3 py-2">
                            <Text className="text-center text-xs font-semibold text-white">Notify</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 rounded-full bg-slate-100 px-3 py-2"
                            onPress={() => setIsDetailsOpen(true)}
                        >
                            <Text className="text-center text-xs font-semibold text-slate-700">Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 items-center rounded-full bg-amber-100 px-3 py-2"
                            accessibilityLabel="Save to favourites"
                            onPress={handleAddToFavourites}
                            disabled={isSavingFavourite}
                        >
                            <MaterialIcons name="favorite-border" size={18} color="#92400e" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal visible={isDetailsOpen} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/40">
                    <View className="rounded-t-3xl bg-white px-5 pb-6 pt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-lg font-bold text-slate-900">Service {serviceNo}</Text>
                            <TouchableOpacity onPress={() => setIsDetailsOpen(false)}>
                                <Text className="text-sm font-semibold text-slate-600">Close</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="mt-2 text-sm text-slate-600">
                            Destination: {nextBus?.destinationCode ?? '--'}
                        </Text>
                        <Text className="mt-1 text-sm text-slate-600">ETA: {formatEta(nextBus?.countDown ?? null)}</Text>
                        <Text className="mt-1 text-sm text-slate-600">Next: {getNextLine()}</Text>
                        <Text className="mt-3 text-xs text-slate-400">
                            Service notes and full stop list will appear here.
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>

    )
}

export default NearbyBusItem;
