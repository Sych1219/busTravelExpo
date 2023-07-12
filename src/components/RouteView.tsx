import {View,Text} from "react-native";
import {Leg} from "@components/BusRoutes";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../screens/SearchScreen";
interface RouteViewProps {
    leg: Leg;
}
type RouteViewProp = RouteProp<StackParamList, 'RouteView'>;
const RouteView = () => {
    const route = useRoute<RouteViewProp>();
    const leg:Leg = route.params;
    console.log("leg",leg);
    return (
        <View>
            <Text>{leg?.startAddress}</Text>
        </View>
    )
}

export default RouteView;