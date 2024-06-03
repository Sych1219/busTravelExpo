import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import MapView, {LatLng, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY} from "@utils/Keys";
import {Client, DirectionsResponseData} from "@googlemaps/google-maps-services-js";
import {TransitMode, TravelMode} from "@googlemaps/google-maps-services-js/src/common";

interface TransitInfo {
    origin: string;
    destination: string;
}

const MapScreen: React.FC = () => {


    const [transitInfo, setTransitInfo] = useState<TransitInfo | null>(null);
    const [coordinates, setCoordinates] = useState<LatLng[]>([]);

    useEffect(() => {
        if (transitInfo) {
            getDirections();
        }
    }, [transitInfo]);

    // const getDirections = async () => {
    //     const {origin, destination} = transitInfo!;
    //     console.log("origin", origin, destination)
    //     const response = await fetch(
    //         `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=${GOOGLE_API_KEY}`
    //     );
    //     const data = await response.json();
    //
    //
    //     if (data.status === 'OK') {
    //         const route = data.routes[0];
    //         const steps = route.legs[0].steps;
    //         console.log("getDirections", JSON.stringify(data));
    //         const coordinates: LatLng[] = steps
    //             .filter((step: any) => step.travel_mode === 'TRANSIT')
    //             .map((step: any) => ({
    //                 latitude: step.start_location.lat,
    //                 longitude: step.start_location.lng,
    //             }));
    //
    //         setCoordinates(coordinates);
    //     }
    // };
    const getDirections = async () => {
        const {origin, destination} = transitInfo!;
        console.log("origin---", origin, destination);
        console.log("destination---", destination);

        const client = new Client({});

        try {
            const response = await client.directions({
                params: {
                    origin,
                    destination,
                    // transit_mode: [TransitMode.bus, TransitMode.subway],
                    key: ""
                }
            });

            const data: DirectionsResponseData = response.data;

            if (data.status === 'OK') {
                const route = data.routes[0];
                const steps = route.legs[0].steps;

                const coordinates: LatLng[] = steps
                    .filter((step) => {
                        console.log("step.travel_mode", step.travel_mode.toString(), TravelMode.driving.toUpperCase(), step.travel_mode=== TravelMode.driving);
                        return step.travel_mode.toString() === 'DRIVING'
                    })
                    .map((step) => ({
                        latitude: step.start_location.lat,
                        longitude: step.start_location.lng,
                    }));

                console.log("coordinates", coordinates);
                setCoordinates(coordinates);
            }
        } catch (error) {
            console.error("Error retrieving directions:", error);
        }
    };


    const handleMapPress = (event: any) => {
        const {coordinate} = event.nativeEvent;

        if (!transitInfo || !transitInfo.origin) {
            setTransitInfo({origin: `${coordinate.latitude},${coordinate.longitude}`, destination: ''});
        } else if (!transitInfo.destination) {
            setTransitInfo({...transitInfo, destination: `${coordinate.latitude},${coordinate.longitude}`});
        }
    };

    return (
        <View style={{flex: 1}}>
            <MapView
                style={{flex: 1}}
                provider={'google'}
                onPress={handleMapPress}
                initialRegion={{
                    latitude: 1.3521,
                    longitude: 103.8198,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {transitInfo && transitInfo.origin && (
                    <Marker coordinate={{
                        latitude: parseFloat(transitInfo.origin.split(',')[0]),
                        longitude: parseFloat(transitInfo.origin.split(',')[1])
                    }}/>
                )}
                {transitInfo && transitInfo.destination && (
                    <Marker coordinate={{
                        latitude: parseFloat(transitInfo.destination.split(',')[0]),
                        longitude: parseFloat(transitInfo.destination.split(',')[1])
                    }}/>
                )}
                {coordinates.length > 0 && (
                    <MapViewDirections
                        origin={transitInfo!.origin}
                        destination={transitInfo!.destination}
                        waypoints={coordinates}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={5}
                        strokeColor="blue"
                    />
                )}
            </MapView>
        </View>
    );
};

export default MapScreen;
