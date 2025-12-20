import {View, Text} from "react-native";
import {LegViewProps} from "@components/search/RouteView";
import{Marker, Polyline} from "react-native-maps";

const LegView = ({steps}: LegViewProps) => {
    console.log("steps in LegView",steps);
    return (
        <>
            {
                steps.map((stepItem, index) => (
                    stepItem.type == 'bus' ?
                        <View key={index}>
                            <Marker coordinate={stepItem.legPoints[0]} title={stepItem.startAddress}>
                                {/* You can customize the marker icon here */}
                                {/* For example, you can use an image: */}
                                {/* <Image source={require('./path-to-start-icon.png')} /> */}

                            </Marker>
                            <Polyline coordinates={stepItem.legPoints} strokeWidth={5}
                                      strokeColor={'green'}/>
                            <Marker coordinate={stepItem.legPoints[stepItem.legPoints.length - 1]}
                                    title={stepItem.endAddress}>
                                {/* You can customize the marker icon here */}
                                {/* For example, you can use an image: */}
                                {/* <Image source={require('./path-to-start-icon.png')} /> */}

                            </Marker>
                        </View> :

                        <Polyline key={index} coordinates={stepItem.legPoints} strokeWidth={5} strokeColor={'red'}
                                  lineDashPattern={[2, 5]}/>))
            }
        </>

    )
}

export default LegView;