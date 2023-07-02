import {View, Text} from "react-native";
import {useLocation} from "@utils/CustomerHook";

interface BusRoutesProps {
    destinationPlaceId: string;
}

const BusRoutes = ({destinationPlaceId}: BusRoutesProps) => {
    const {location, errorMsg} = useLocation();
    console.log("useLocation", location)
    return (
        location == null ?
            (<View>
                <Text>loading</Text>
            </View>) : (<View>
                <Text> orign : {location.latitude}, {location.longitude}</Text>
                <Text> destination : {destinationPlaceId}</Text>
            </View>)
    )
}
export default BusRoutes;