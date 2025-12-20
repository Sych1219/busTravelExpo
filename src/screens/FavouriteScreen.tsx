import React, {useEffect, useState} from "react";
import {SafeAreaView, Text} from "react-native";
import NearbyBusItem, {NextBus} from "@components/shared/NearbyBusItem";
import axios, {AxiosRequestConfig} from "axios";
import {userFavoriteBusStopUrl} from "@utils/UrlsUtil";
import FavouriteBusItem from "@components/favourite/FavouriteBusItem";


interface FavouriteBus {
    busStop: BusStop;
    busCode: string;
    nextBus: NextBus;
    nextBus2: NextBus;
    nextBus3: NextBus;
}

interface BusStop {
    distanceToUser: number;
    busStopCode: string;
    roadName: string;
    description: string;
    latitude: number;
    longitude: number;
}

interface BusArrivingRequestParams {
    longitude: number;
    latitude: number;
    deviceId: number;
}


const FavouriteScreen = () => {
    const [favouriteBuses, setFavouriteBuses] = useState<FavouriteBus[]>([]);
    useEffect(() => {
        const params: BusArrivingRequestParams = {
            longitude: 103.9004605,
            latitude: 1.4037280,
            deviceId: 1,
        }
        const config: AxiosRequestConfig = {
            params: params,
        };
        try {
            axios.get<FavouriteBus[]>(userFavoriteBusStopUrl, config).then((response) => {
                setFavouriteBuses(response.data);
            });
        } catch (error) {
            throw new Error('Failed to fetch data');
        }
    }, []);

    return (
        <SafeAreaView>
            {
                favouriteBuses.length > 0 ? favouriteBuses.map((item, index) =>
                    (<FavouriteBusItem key={index}
                              serviceNo={item.busCode}
                              operator={"hardcode operator"}
                              nextBus={item.nextBus}
                              nextBus2={item.nextBus2}
                              nextBus3={item.nextBus3}
                    />)
                ) : <Text className={'text-lg text-red-500'}>no data</Text>
            }


        </SafeAreaView>
    );


}

export default FavouriteScreen;
