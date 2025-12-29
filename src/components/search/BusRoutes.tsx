import {View} from "react-native";
import type {Service} from "@components/shared/NearbyBusItem";

interface BusRoutesProps {
    destinationPlaceId: string;
}

export interface Step {
    distance: TextValue
    duration: TextValue
    departureStop: string | null;
    startLocation: LatLng
    arrivalStop: string | null;
    endLocation: LatLng
    numStops: number | null;
    busCode: string | null;
    travelMode: "driving" | "walking" | "bicycling" | "transit";
    polyline: Polyline;
    htmlInstruction?: string;
    serviceVO?: Service | null;
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
    totalDuration?: number;
}

export interface StartEndStop {
    startStopName: string;
    endStopName: string;
}

export interface StartEndStopServiceNo {
    startEndStops: StartEndStop[];
    serviceNo: string;
}
const mockLegs: Leg[] = [];
// const mockLegs: Leg[] = [
//     {
//         distance: {text: "2.5 km", value: 2500},
//         duration: {text: "15 mins", value: 900},
//         startAddress: "123 Main St, City A",
//         startLocation: {lat: 1.234567, lng: 2.345678},
//         endAddress: "456 Elm St, City B",
//         endLocation: {lat: 3.456789, lng: 4.567890},
//         steps: [
//             {
//                 distance: {text: "1.2 km", value: 1200},
//                 duration: {text: "8 mins", value: 480},
//                 departureStop: "Bus Stop A",
//                 startLocation: {lat: 1.234567, lng: 2.345678},
//                 arrivalStop: "Bus Stop B",
//                 endLocation: {lat: 2.345678, lng: 3.456789},
//                 numStops: 3,
//                 busCode: "11",
//                 travelMode: "transit",
//                 polyline: {points: "abc123xyz"},
//             },
//             {
//                 distance: {text: "1.3 km", value: 1300},
//                 duration: {text: "7 mins", value: 420},
//                 departureStop: "Bus Stop B",
//                 startLocation: {lat: 2.345678, lng: 3.456789},
//                 arrivalStop: "Bus Stop C",
//                 endLocation: {lat: 3.456789, lng: 4.567890},
//                 numStops: 2,
//                 busCode: "12",
//                 travelMode: "transit",
//                 polyline: {points: "def456uvw"},
//             },
//         ],
//     },
//     {
//         distance: {text: "2.5 km", value: 2500},
//         duration: {text: "15 mins", value: 900},
//         startAddress: "123 Main St, City A",
//         startLocation: {lat: 1.234567, lng: 2.345678},
//         endAddress: "456 Elm St, City B",
//         endLocation: {lat: 3.456789, lng: 4.567890},
//         steps: [
//             {
//                 distance: {text: "1.2 km", value: 1200},
//                 duration: {text: "8 mins", value: 480},
//                 departureStop: "Bus Stop A",
//                 startLocation: {lat: 1.234567, lng: 2.345678},
//                 arrivalStop: "Bus Stop B",
//                 endLocation: {lat: 2.345678, lng: 3.456789},
//                 numStops: 3,
//                 busCode: "22",
//                 travelMode: "transit",
//                 polyline: {points: "abc123xyz"},
//             },
//             {
//                 distance: {text: "1.3 km", value: 1300},
//                 duration: {text: "7 mins", value: 420},
//                 departureStop: "Bus Stop B",
//                 startLocation: {lat: 2.345678, lng: 3.456789},
//                 arrivalStop: "Bus Stop C",
//                 endLocation: {lat: 3.456789, lng: 4.567890},
//                 numStops: 2,
//                 busCode: "221",
//                 travelMode: "transit",
//                 polyline: {points: "def456uvw"},
//             },
//         ],
//     },
//     // Add more mock legs here...
// ];

function mapLegToStartEndStopServiceNo(leg: Leg): StartEndStopServiceNo {
    const startEndStops: StartEndStop[] = leg.steps.map((step) => {
        return {
            startStopName: step.departureStop ?? '',
            endStopName: step.arrivalStop ?? '',
        }
    });
    return {
        startEndStops: startEndStops,
        serviceNo: leg.steps[0]?.busCode ?? '',
    }
}


const BusRoutes = ({destinationPlaceId}: BusRoutesProps) => {
    // const {location, errorMsg} = useLocation();
    // const [legs, setLegs] = useState<Leg[]>(mockLegs);
    // const [startEndStopServiceNos, setStartEndStopServiceNos]
    //     = useState<StartEndStopServiceNo[]>([]);
    //based on the location, or destinationPlaceId change, will fetch the bus routes
    // useEffect(() => {
    //     if (location != null && destinationPlaceId != null && destinationPlaceId.length > 0) {
    //         const origin = location.latitude + "," + location.longitude;
    //         const destination = "place_id:" + destinationPlaceId;
    //         console.log("origin and destination", origin, destination);
    //         axios.get<Route[]>(routesUrl, {params: {origin: origin, destination: destination}}).then((response) => {
    //             const routes = response.data;
    //             console.log("routes length", routes.length);
    //             // Keep each Route as a single UI option by merging its legs; within a route we still "connect" transit by flattening steps.
    //             const legs = routes
    //                 .map((route) => mergeLegs(route.legs))
    //                 .filter((leg): leg is Leg => leg != null);
    //             const startEndStopServiceNos1: StartEndStopServiceNo[] = legs.map((leg) => {
    //                 return mapLegToStartEndStopServiceNo(leg);
    //             });
    //             setStartEndStopServiceNos(startEndStopServiceNos1);
    //             console.log("legs length", legs.length);
    //             setLegs(legs);
    //         }).catch((error) => {
    //             console.log("error in BusRoutes.tsx", error);
    //         });

    //     }

    // }, [location, destinationPlaceId]);
    return (
        // legs == null || legs.length == 0 ?
        //     (<View>
        //         <Text>loading</Text>
        //     </View>) : (
        //         <View>
        //             {legs.map((leg, indexLeg) => (
        //                 <View key={indexLeg}>
        //                     <TouchableOpacity className={'w-full flex-row px-4 py-2'}
        //                                       onPress={() =>
        //                                           navigation.navigate('RouteView', leg)
        //                                       }>
        //                         {/*//todo if the let.steps size >=3, then show the first 1 step, and the last step*/}
        //                         {leg.steps.map((step, indexStep) => (
        //                             <StepItem key={indexStep} step={step} index={indexStep}
        //                                       differentBusCodeCounts={leg.steps.length}
        //                                       showArrow={indexStep !== (leg.steps.length - 1)}/>

        //                         ))
        //                         }
        //                         <Text className={'flex-1 text-right'}>{leg.duration.text}</Text>
        //                     </TouchableOpacity>
        //                     <Divider height={1} color={'gray'}/>
        //                 </View>
        //             ))}

        //         </View>
        //     )
        <View></View>
    )
}


export default BusRoutes;
