import {View, Text, TouchableOpacity} from "react-native";
import {useLocation} from "@utils/CustomerHook";
import {useEffect, useState} from "react";
import axios from "axios";
import {routesUrl} from "@utils/UrlsUtil";
import Divider from "@components/Divider";
import StepItem from "@components/StepItem";
import {useNavigation} from "@react-navigation/native";
import {StackParamList} from "../screens/SearchScreen";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface BusRoutesProps {
    destinationPlaceId: string;
}

export interface Step {
    distance: TextValue
    duration: TextValue
    departureStop: string;
    startLocation: LatLng
    arrivalStop: string;
    endLocation: LatLng
    numStops: number;
    busCode: string;
    travelMode: "driving" | "walking" | "bicycling" | "transit";
    polyline: Polyline;
}

export interface Polyline {
    points: string;

}

export interface TextValue {
    text: string;
    value: number;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Leg {
    distance: TextValue
    duration: TextValue
    startAddress: string;
    startLocation: LatLng
    endAddress: string;
    endLocation: LatLng
    steps: Step[];

}

export interface Route {
    legs: Leg[];
}

const mockLegs: Leg[] = [
    {
        distance: {text: "2.5 km", value: 2500},
        duration: {text: "15 mins", value: 900},
        startAddress: "123 Main St, City A",
        startLocation: {lat: 1.234567, lng: 2.345678},
        endAddress: "456 Elm St, City B",
        endLocation: {lat: 3.456789, lng: 4.567890},
        steps: [
            {
                distance: {text: "1.2 km", value: 1200},
                duration: {text: "8 mins", value: 480},
                departureStop: "Bus Stop A",
                startLocation: {lat: 1.234567, lng: 2.345678},
                arrivalStop: "Bus Stop B",
                endLocation: {lat: 2.345678, lng: 3.456789},
                numStops: 3,
                busCode: "123",
                travelMode: "transit",
                polyline: {points: "abc123xyz"},
            },
            {
                distance: {text: "1.3 km", value: 1300},
                duration: {text: "7 mins", value: 420},
                departureStop: "Bus Stop B",
                startLocation: {lat: 2.345678, lng: 3.456789},
                arrivalStop: "Bus Stop C",
                endLocation: {lat: 3.456789, lng: 4.567890},
                numStops: 2,
                busCode: "456",
                travelMode: "transit",
                polyline: {points: "def456uvw"},
            },
        ],
    },
    {
        distance: {text: "2.5 km", value: 2500},
        duration: {text: "15 mins", value: 900},
        startAddress: "123 Main St, City A",
        startLocation: {lat: 1.234567, lng: 2.345678},
        endAddress: "456 Elm St, City B",
        endLocation: {lat: 3.456789, lng: 4.567890},
        steps: [
            {
                distance: {text: "1.2 km", value: 1200},
                duration: {text: "8 mins", value: 480},
                departureStop: "Bus Stop A",
                startLocation: {lat: 1.234567, lng: 2.345678},
                arrivalStop: "Bus Stop B",
                endLocation: {lat: 2.345678, lng: 3.456789},
                numStops: 3,
                busCode: "123",
                travelMode: "transit",
                polyline: {points: "abc123xyz"},
            },
            {
                distance: {text: "1.3 km", value: 1300},
                duration: {text: "7 mins", value: 420},
                departureStop: "Bus Stop B",
                startLocation: {lat: 2.345678, lng: 3.456789},
                arrivalStop: "Bus Stop C",
                endLocation: {lat: 3.456789, lng: 4.567890},
                numStops: 2,
                busCode: "456",
                travelMode: "transit",
                polyline: {points: "def456uvw"},
            },
        ],
    },
    // Add more mock legs here...
];
const BusRoutes = ({destinationPlaceId}: BusRoutesProps) => {
    const {location, errorMsg} = useLocation();
    const [legs, setLegs] = useState<Leg[]>(mockLegs);
    //based on the location, or destinationPlaceId change, will fetch the bus routes
    useEffect(() => {
        if (location != null && destinationPlaceId != null && destinationPlaceId.length > 0) {
            const origin = location.latitude + "," + location.longitude;
            const destination = "place_id:" + destinationPlaceId;
            axios.get<Route[]>(routesUrl, {params: {origin: origin, destination: destination}}).then((response) => {
                const routes = response.data;
                console.log("routes length", routes.length);
                //from the routes, get the legs
                const legs = routes.map((route) => route.legs).flat();
                console.log("legs length", legs.length);
                setLegs(legs);

            })

        }

    }, [location, destinationPlaceId]);
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList, 'SearchView'>>();
    return (
        legs == null || legs.length == 0 ?
            (<View>
                <Text>loading</Text>
            </View>) : (
                <View>
                    {legs.map((leg, indexLeg) => (
                        <View key={indexLeg}>
                            <TouchableOpacity className={'w-full flex-row px-4 py-2'}
                                              onPress={() =>
                                                  navigation.navigate('ListWalkAndStopsView', leg)
                                              }>
                                {leg.steps.map((step, indexStep) => (
                                    <StepItem key={indexStep} step={step} index={indexStep}
                                              showArrow={indexStep !== (leg.steps.length - 1)}/>

                                ))
                                }
                                <Text className={'flex-1 text-right'}>{leg.duration.text}</Text>
                            </TouchableOpacity>
                            <Divider height={1} color={'gray'}/>
                        </View>
                    ))}

                </View>
            )
    )
}


export default BusRoutes;