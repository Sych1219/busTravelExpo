import {View, Text, FlatList, TouchableOpacity} from "react-native";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../screens/SearchScreen";
import {LatLng, TextValue} from "@components/BusRoutes";
import {useEffect, useState} from "react";
import axios from "axios";
import {busRoutesByStopNameUrl} from "@utils/UrlsUtil";
import BusStopsOnBarView from "@components/BusStopsOnBarView";


type RouteViewProp = RouteProp<StackParamList, 'ListWalkAndStopsView'>;

interface StartAndEndStopInfo {
    departureStop: string;
    arrivalStop: string;
    numStops: number;
    serviceNo: string;
}

interface WalkInfo {
    distance: TextValue
    duration: TextValue
    endLocation: LatLng
}

export type BusStopVO = {
    distanceToUser: number;
    busStopCode: string;
    roadName: string;
    description: string;
    latitude: number;
    longitude: number;
}

export interface BusRouteVO {
    id: string;
    serviceNo: string;
    operator: string;
    direction: number;
    stopSequence: number;
    busStopCode: string;
    busStopVO: BusStopVO;
    distance: number;
    wdFirstBus: string;
    wdLastBus: string;
    satFirstBus: string;
    satLastBus: string;
    sunFirstBus: string;
    sunLastBus: string;

}

export interface BusServiceNoAndBusRouteVOs {
    serviceNo: string;
    busRouteVOs: BusRouteVO[];
}

const ListWalkAndStopsView = () => {
    const route = useRoute<RouteViewProp>();
    const leg = route.params;
    let walkInfos: WalkInfo[] = [];
    let startAndEndStopInfos: StartAndEndStopInfo[] = [];
    leg.steps.forEach((step) => {
        if (step.travelMode === 'walking') {
            const walkInfo: WalkInfo = {
                distance: step.distance,
                duration: step.duration,
                endLocation: step.endLocation
            }
            walkInfos.push(walkInfo);
        }

        if (step.travelMode === 'transit') {
            const startAndEndStopInfo: StartAndEndStopInfo = {
                departureStop: step.departureStop,
                arrivalStop: step.arrivalStop,
                numStops: step.numStops,
                serviceNo: step.busCode
            }
            startAndEndStopInfos.push(startAndEndStopInfo);
        }
    });

    const [busServiceNoAndRouteVOs, setBusServiceNoAndRouteVOs]
        = useState<BusServiceNoAndBusRouteVOs[]>([]);

    //base on the start and end stop finfo s to fetch\\
    useEffect(() => {
        fetchBusServiceNoWithStopRouteVOs(startAndEndStopInfos).then((newFetch) => {
            busServiceNoAndRouteVOs.push(...newFetch)
            setBusServiceNoAndRouteVOs(newFetch);
        });
    }, []);


    const fetchBusServiceNoWithStopRouteVOs = async (startAndEndStopInfos: StartAndEndStopInfo[]) => {
        const toReturn: BusServiceNoAndBusRouteVOs[] = [];
        for (const startAndEndStopInfo of startAndEndStopInfos) {
            const busRouteVOs = await fetchBusStopRouteVOs(startAndEndStopInfo);
            const busServiceNoAndBusRouteVOs: BusServiceNoAndBusRouteVOs = {
                serviceNo: startAndEndStopInfo.serviceNo,
                busRouteVOs: busRouteVOs,
            }
            toReturn.push(busServiceNoAndBusRouteVOs);
        }

        return toReturn;
    }

    const fetchBusStopRouteVOs = async (startAndEndStopInfo: StartAndEndStopInfo) => {
        const response = await axios.get<BusRouteVO[]>(busRoutesByStopNameUrl, {
            params: {
                departureStop: `${startAndEndStopInfo.departureStop}`,
                arrivalStop: `${startAndEndStopInfo.arrivalStop}`,
                serviceNo: `${startAndEndStopInfo.serviceNo}`,
            }
        });
        const busRouteVOs = response.data;
        return busRouteVOs;
    }

    return (
        <View>
            {
                busServiceNoAndRouteVOs.map((busServiceNoAndRouteVO, index) => {
                    return (
                        <BusStopsOnBarView serviceNo={busServiceNoAndRouteVO.serviceNo}
                                           busRouteVOs={busServiceNoAndRouteVO.busRouteVOs}/>
                    )
                })
            }
        </View>)
};

export default ListWalkAndStopsView;