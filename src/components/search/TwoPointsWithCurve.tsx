import React, {useEffect, useState} from 'react';
import {View, Dimensions, Animated, Easing, Image, Text as TextRN} from 'react-native';
import Svg, {Path, Circle, Text, Line, G} from 'react-native-svg';
import {BusRouteVO, BusServiceNoAndBusRouteVOs} from "@components/search/ListWalkAndStopsView";
import axios, {AxiosRequestConfig} from "axios";
import {busServiceUrl} from "@utils/UrlsUtil";
import {BusServiceParams, Service} from "@components/shared/NearbyBusItem";
import {formatCountdown, truncateString} from "@utils/UtilsMethod";

export interface BusSVGInfo {
    //start point
    cx: number;
    cy: number;
    //start point is on left or right
    isOnLeft: boolean;
    //end point
    nextCx: number;
    nextCy: number;
    //this is to arrive info, route the name is not proper
    busRouteVO: BusRouteVO | null;
    isWalkRoute?: boolean;
    isLastPoint: boolean;
    // is bus on the line from start point to end point
    toArriveBusStopCode: string | null;
}

const TwoPointsWithCurve = ({busRouteVOs}: BusServiceNoAndBusRouteVOs) => {

    const [busPosition, setBusPostion] = useState(new Animated.Value(0));

    // Get the screen width
    const screenWidth = Dimensions.get('window').width;
    //left is 80, right is 80
    const leftX = 80;
    const rightX = screenWidth - 80; //350
    const stratCy = 10;
    // const busRouteVOs = busServiceNoAndBusRouteVOs;
    //first map busRouteVOs to BusSVGInfo list
    //2. map busRouteVos to toArrivBusStopCode : BusSVGInfo

    //busRouteVOs need to add a start point
    let startPoint = {...busRouteVOs[0]};
    startPoint.busStopCode = "stratPoint";
    startPoint.busStopVO = {
        distanceToUser: 0,
        busStopCode: busRouteVOs[0].busStopVO.busStopCode,
        roadName: busRouteVOs[0].busStopVO.roadName,
        description: "start point",
        latitude: busRouteVOs[0].busStopVO.latitude,
        longitude: busRouteVOs[0].busStopVO.longitude,
    };

    console.log("startPoint", startPoint)

    const busRouteVOs1 = [startPoint, ...busRouteVOs];
    const length = busRouteVOs1.length;
    const busSVGInfos: BusSVGInfo[] = busRouteVOs1.map((busRouteVO, index) => {
        const isOnLeft = index % 2 == 0;
        const cx = isOnLeft ? leftX : rightX;
        const cy = stratCy + index * 50;
        //next cx and cy
        const nextCx = isOnLeft ? rightX : leftX;
        const nextCy = stratCy + (index + 1) * 50;

        const isLastPoint = index == busRouteVOs1.length - 1;
        return {
            cx: cx,
            cy: cy,
            isOnLeft: isOnLeft,
            nextCx: nextCx,
            nextCy: nextCy,
            busRouteVO: busRouteVO,
            isWalkRoute: index != 0 && busRouteVOs1[index - 1].serviceNo != busRouteVO.serviceNo,
            isLastPoint: isLastPoint,
            toArriveBusStopCode: busRouteVOs1[index + 1] != undefined ? busRouteVOs1[index + 1].busStopCode : null//busRouteVO.busStopCode,
        }
    })

    // const descriptions: string[] = busSVGInfos.map((item) => item.busRouteVO?.busStopVO.description)
    // console.log("busSVGInfos descriptions", descriptions)

    const busArrivingInfoSVGInfoMap: { [key: string]: BusSVGInfo } = {};
    busSVGInfos.forEach((item, index) => {
        console.log("item.toArriveBusStopCode", item.toArriveBusStopCode)
        if (item.toArriveBusStopCode == null) {
            busArrivingInfoSVGInfoMap['null'] = item;
            return
        }
        busArrivingInfoSVGInfoMap[item.toArriveBusStopCode] = item;
    });


    console.log("null busArrivingInfoSVGInfoMap", busArrivingInfoSVGInfoMap["null"])
    // BusSVGInfo state hook
    const [busSVGInfo, setBusSVGInfo] = useState<BusSVGInfo>(busSVGInfos[0]);

    //2. api(busServiceUrl) to fetch data
    let previousCountDown = Number.MAX_VALUE;
    let currentWorkingIndex = 0;
    // let toArrivalStop = busArrivingInfo.toArriveBusStopCode;
    // console.log("busArrivingInfo.serviceNo", busArrivingInfo.serviceNo)
    const params: BusServiceParams = {
        busStopCode: busRouteVOs1[0].busStopVO.busStopCode, // toArrivalStop,
        busCode: busRouteVOs1[0]?.serviceNo//busArrivingInfo.serviceNo//busArrivingInfo.serviceNo, busRouteVOs[1]?.serviceNo
    }
    let busServiceUrlParameter: AxiosRequestConfig = {
        params: params,
    };
    // console.log("busSVGInfos length", busSVGInfos.length)
    // react hook for bus count down
    const [busCountDown, setBusCountDown] =
        useState<number>(0/*busArrivingInfo.nextBus.countDown*/);
    let intervalIdToClear: NodeJS.Timeout = null;
    const animateBus = () => {
        axios.get<Service>(busServiceUrl, busServiceUrlParameter).then((response) => {
            const nextBus = response.data.nextBus;
            setBusCountDown(nextBus?.countDown ?? 0);
            const intervalId = setInterval(() => {
                setBusCountDown((prevCountDown) => {
                    if (prevCountDown - 1 <= 0) {
                        return 0;
                    }
                    return prevCountDown - 1
                });
                // setBusCountDown(busCountDown-1)
            }, 1000);
            console.log("intervalId", intervalId)
            intervalIdToClear = intervalId;
            // Configure the animation

            Animated.timing(busPosition, {
                toValue: 1, // End value (100% progress)
                duration: (nextBus?.countDown ?? 0) * 100, // Duration in milliseconds (adjust as needed)
                useNativeDriver: false, // Set this to true if possible for better performance
            }).start(() => {
                // Animation has completed, reset the busPosition and restart the animation
                currentWorkingIndex = currentWorkingIndex + 1;
                previousCountDown = Number.MAX_VALUE;
                if (currentWorkingIndex != busSVGInfos.length - 1) {
                    const toArrivalStop = busSVGInfos[currentWorkingIndex].toArriveBusStopCode;
                    //the to arrival stop also need to update
                    const nextBusStopCode = busSVGInfos[currentWorkingIndex].toArriveBusStopCode;
                    const busSVGInfo = busArrivingInfoSVGInfoMap[nextBusStopCode];
                    setBusSVGInfo(busSVGInfo)
                    const paramsNew: BusServiceParams = {
                        busStopCode: toArrivalStop,
                        busCode: busRouteVOs1[currentWorkingIndex].serviceNo,
                    }
                    busServiceUrlParameter = {
                        params: paramsNew,
                    };
                    busPosition.setValue(0);
                    animateBus();

                }
                //clear interval
                clearInterval(intervalId)
                console.log("clear interval:", intervalId)
            });
        })

    };
    useEffect(() => {
        animateBus();

        return () => {
            // Clean up animation when component unmounts (not required for React Native)
            if (intervalIdToClear) {
                console.log("clear interval in effect")
                clearInterval(intervalIdToClear)
            }
        };
    }, []);

    return (
        // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}> style={{zIndex:-10}}

        <View>
            <Svg>
                {
                    busSVGInfos.map((busSVGInfo, index) => {
                        const cx = busSVGInfo.cx;
                        const cy = busSVGInfo.cy;
                        //next cx and cy
                        const nextCx = busSVGInfo.nextCx;
                        const nextCy = busSVGInfo.nextCy;
                        const description = busSVGInfo.busRouteVO.busStopVO.description //truncateString(busSVGInfo.busRouteVO.busStopVO.description, 9);
                        return (
                            <G key={index}>
                                <Circle cx={cx} cy={cy} r="4" fill="red"/>
                                {busSVGInfo.isOnLeft ?
                                    <Text x={cx - 75} y={cy + 5} fill="black" fontSize={12}
                                          fontWeight="bold">
                                        {description}
                                    </Text> :
                                    <Text x={cx + 5} y={cy + 5} fill="black" fontSize={12}
                                          fontWeight="bold">
                                        {description}
                                    </Text>}
                                {!busSVGInfo.isLastPoint &&
                                    <Line x1={cx} y1={cy} x2={nextCx}
                                          y2={nextCy} stroke={busSVGInfo.isWalkRoute ? "green" : "blue"}
                                          stroke-width="2"/>}
                            </G>
                        )
                    })
                }
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateX: busPosition.interpolate({
                                    inputRange: [0, 1],
                                    // outputRange: [80, 350], // Adjust the range based on your needs
                                    outputRange: [busSVGInfo.cx, busSVGInfo.nextCx], // Adjust the range based on your needs
                                })
                            },
                            {
                                translateY: busPosition.interpolate({
                                    inputRange: [0, 1],
                                    // outputRange: [80, 130], // Adjust the range based on your needs
                                    outputRange: [busSVGInfo.cy, busSVGInfo.nextCy], // Adjust the range based on your needs
                                })
                            },
                        ],
                    }}
                >
                    {/* Bus component or image */}
                    <View className={'h-8 w-10 items-center justify-center'}
                        // style={{
                        //     width: 20,
                        //     height: 20,
                        //     backgroundColor: 'red',
                        //     borderRadius: 10,
                        // }}
                    >
                        <Image source={require('@assets/single_deck.png')} style={{width: 20, height: 20}}/>
                        <TextRN>{formatCountdown(busCountDown)}</TextRN>
                    </View>
                </Animated.View>
            </Svg>
        </View>
    );
};

export default TwoPointsWithCurve;
