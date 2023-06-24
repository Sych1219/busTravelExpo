import {ScrollView} from "react-native";
import {BusStopWithBusesInfoProps} from "../screens/NearbyScreen";
import NearbyBusItem from "@components/NearbyBusItem";

type ScrollWithBusItemsProps = {
    busStopWithBusesInfo: BusStopWithBusesInfoProps;
}
const ScrollWithBusItems = ({busStopWithBusesInfo}: ScrollWithBusItemsProps) => {
    return (
        <ScrollView>
            {busStopWithBusesInfo.services.map((service, serviceIndex) => (
                (<NearbyBusItem
                    key={serviceIndex}
                    serviceNo={service.serviceNo}
                    operator={service.operator}
                    nextBus={service.nextBus}
                    nextBus2={service.nextBus2}
                    nextBus3={service.nextBus3}
                />)
            ))}
        </ScrollView>
    );
}

export default ScrollWithBusItems;
