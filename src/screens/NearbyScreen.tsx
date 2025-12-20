import React from "react";
import NearbyTabView from "@components/nearby/NearbyTabView";
import {Service} from "@components/shared/NearbyBusItem";

export interface BusStopWithBusesInfoProps {
    busStopRoadName: string;
    busStopCode: string;
    distanceToBusStop: number;
    busStopDescription: string;
    services: Service[];
}


export interface RouteProps {
    key: string;
    title: string;
}
const NearbyScreen = () => {
    return (
        <NearbyTabView />
    );
}

export default NearbyScreen;
