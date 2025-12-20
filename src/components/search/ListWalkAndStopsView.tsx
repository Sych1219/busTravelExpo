import {View, Text, FlatList, TouchableOpacity, ScrollView} from "react-native";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../../screens/SearchScreen";
import {LatLng, TextValue} from "@components/search/BusRoutes";
import {useEffect, useState} from "react";
import axios from "axios";
import {busRoutesByStopNameUrl} from "@utils/UrlsUtil";
import BusStopsOnBarView from "@components/search/BusStopsOnBarView";
import {NextBus} from "@components/shared/NearbyBusItem";
import TwoPointsWithCurve from "@components/search/TwoPointsWithCurve";


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
    serviceNo?: string;
    busRouteVOs: BusRouteVO[];
    busArrivingInfo?: BusArrivingInfo;
}

//bus arrving info
export interface BusArrivingInfo {
    serviceNo: string;
    toArriveBusStopCode: string;
    operator: string;
    nextBus: NextBus;
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
        }).catch((error) => {
            console.log("fetchBusServiceNoWithStopRouteVOs error:", error);
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
    //"busStopCode": "65009",
    const arrvingInfo: BusArrivingInfo = {
        serviceNo: "34",
        toArriveBusStopCode: "65221",
        operator: "SBST",
        nextBus: {
            estimatedArrival: "2021-09-01T12:00:00+08:00",
            load: "SEA",
            feature: "WAB",
            type: "SD",
            countDown: 1,
            originCode: "65221",
            destinationCode: "65222",
            latitude: "1.234567",
            longitude: "2.345678",
            visitNumber: "1",
        }
    };
    const busVos = busServiceNoAndRouteVOs.flatMap((busServiceNoAndRouteVO, index) => {
        return busServiceNoAndRouteVO.busRouteVOs
    });
    const busvos = busServiceNoAndRouteVOs.flatMap((busServiceNoAndRouteVO, index) => {
        return busServiceNoAndRouteVO.busRouteVOs
    });
    console.log("busvos is ", busvos)
    return (
        <View className={'w-full h-full flex-col space-x-1'}>
            {

                busVos != null && busVos.length > 0
                && <TwoPointsWithCurve busRouteVOs={busVos}/>
                // busServiceNoAndRouteVOs/*.filter((_,index)=>index==0)*/
                //     .map((busServiceNoAndRouteVO, index) => {
                //         console.log("busServiceNoAndRouteVO is ", busServiceNoAndRouteVO)
                //     return (
                //         // <BusStopsOnBarView serviceNo={busServiceNoAndRouteVO.serviceNo}
                //         //                    busRouteVOs={busServiceNoAndRouteVO.busRouteVOs}
                //         //                    busArrivingInfo={arrvingInfo}/>
                //         <TwoPointsWithCurve /*serviceNo={busServiceNoAndRouteVO.serviceNo}*/
                //                             busRouteVOs={busServiceNoAndRouteVO.busRouteVOs}
                //                             busArrivingInfo={arrvingInfo}/>
                //     )
                // })
            }
        </View>)
};

export default ListWalkAndStopsView;