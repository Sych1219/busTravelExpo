import {View, Text} from "react-native";
import {Leg} from "@components/search/BusRoutes";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../../screens/SearchScreen";
import MapView from "react-native-maps";
import polyline from 'polyline';
import LegView from "@components/search/LegView";

interface RouteViewProps {
    leg: Leg;
}

export interface LatLng {
    latitude: number;
    longitude: number;
}

export interface PolylineViewProps {
    polylineList: LatLng[][];
}

export interface StepViewProps {
    legPoints: LatLng[];
    startAddress: string;
    endAddress: string;
    type: "bus" | "walking";
}

export interface LegViewProps {
    steps: StepViewProps[];
}

type RouteViewProp = RouteProp<StackParamList, 'RouteView'>;
const RouteView = () => {
    const route = useRoute<RouteViewProp>();
    const leg = route.params;

    const steps: StepViewProps[] = leg.steps.map(step => {
        const decodedPolyline = polyline.decode(step.polyline.points);
        const points: LatLng[] = decodedPolyline.map(([latitude, longitude]) => ({
            latitude,
            longitude,
        }));
        if (step.travelMode === 'transit' && step.busCode != null) {
            return {
                legPoints: points,
                startAddress: step.departureStop ?? '',
                endAddress: step.arrivalStop ?? '',
                type: "bus"
            }
        } else {
            return {
                legPoints: points,
                startAddress: step.departureStop ?? '',
                endAddress: step.arrivalStop ?? '',
                type: "walking"
            }
        }

    })


    return (
        <View style={{flex: 1}}>
            <MapView
                style={{flex: 1}}
                initialRegion={{
                    latitude: leg.startLocation.lat,
                    longitude: leg.startLocation.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <LegView steps={steps}/>
            </MapView>
        </View>
    )
}

export default RouteView;
