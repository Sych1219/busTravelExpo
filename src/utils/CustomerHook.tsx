import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import Constants from "expo-constants";
import DeviceInfo from "react-native-device-info";

export interface Loc {
    latitude: number;
    longitude: number;
}

export const useLocation = () => {
    const [location, setLocation] = useState<Loc>(null);
    const [errorMsg, setErrorMsg] = useState<string>(null);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission denied');
                    return;
                }

                const { coords } = await Location.getCurrentPositionAsync();
                console.log("coords", coords)
                const { latitude, longitude } = coords;
                console.log("latitude", latitude, longitude)
                setLocation({ latitude, longitude });
                console.log("location", location)
            } catch (error) {
                setErrorMsg('Failed to fetch location');
            }
        };

        getLocation();
    }, []);

    console.log("lreturn ocation", location)
    return { location, errorMsg };
};
