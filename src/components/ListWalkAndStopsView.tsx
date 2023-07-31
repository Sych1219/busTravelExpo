import {View, Text} from "react-native";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../screens/SearchScreen";
import {LatLng, TextValue} from "@components/BusRoutes";


type RouteViewProp = RouteProp<StackParamList, 'ListWalkAndStopsView'>;

interface StartAndEndStopInfo {
    departureStop: string;
    arrivalStop: string;
    numStops: number;
}

interface WalkInfo {
    distance: TextValue
    duration: TextValue
    endLocation: LatLng
}

const ListWalkAndStopsView = () => {
    const route = useRoute<RouteViewProp>();
    const leg = route.params;
    let walkInfos: WalkInfo[]= [];
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

        if (step.travelMode==='transit') {
            const startAndEndStopInfo: StartAndEndStopInfo = {
                departureStop: step.departureStop,
                arrivalStop: step.arrivalStop,
                numStops: step.numStops
            }
            startAndEndStopInfos.push(startAndEndStopInfo);
        }
    });


    console.log("walkInfos------", walkInfos);
    console.log("startAndEndStopInfos------", startAndEndStopInfos);
    return (
        <View>
            <Text>List WalkAndSto view</Text>
        </View>)
};

export default ListWalkAndStopsView;