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
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            } catch (error) {
                setErrorMsg('Failed to fetch location');
            }
        };

        getLocation();
    }, []);

    return { location, errorMsg };
};
