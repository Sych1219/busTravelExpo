import {ScrollView} from "react-native";
import {BusStopWithBusesInfoProps} from "../screens/NearbyScreen";
import NearbyBusItem from "@components/NearbyBusItem";

type ScrollWithBusItemsProps = {
    busStopWithBusesInfo: BusStopWithBusesInfoProps;
}
const ScrollWithBusItems = ({busStopWithBusesInfo}: ScrollWithBusItemsProps) => {
    const busStopCode = busStopWithBusesInfo.busStopCode;
    return (
        <ScrollView>
            {busStopWithBusesInfo.services.map((service, serviceIndex) => (
                (<NearbyBusItem
                    key={serviceIndex}
                    service={service}
                    busStopCode={busStopCode}/>)
            ))}
        </ScrollView>
    );
}

export default ScrollWithBusItems;
