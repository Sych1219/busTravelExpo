import React from "react";
import CustomerTabView from "@components/CustomerTabView";
import {Service} from "@components/BusItem";

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
        <CustomerTabView />
    );
}

export default NearbyScreen;
