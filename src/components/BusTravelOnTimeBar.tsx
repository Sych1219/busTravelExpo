import {View, Text, SafeAreaView,StyleSheet} from "react-native";

enum TravelManner {
    BUS = "BUS",
    MRT = "MRT",
    WALK = "WALK",
}

interface ServiceProvider {
    providerCompany: string;
    url: string;
}

interface StopInfo {
    stopName: string;
    time: string;
}

interface StarPoint {
    startTime: string;
    startPlace: string;
}

interface BarInfo {
    startPoint: StarPoint;
    travelManner: TravelManner;
    lineName: string; //busRouteName like 34, 858, MRT line name cycleLine, purpleLine
    travelBriefDescription: string;
    stopInfos: StopInfo[];
    serviceProvider: ServiceProvider;
}

export const BusTravelOnTimeBar = () => {

    return (
        // SafeAreaView will remove later, because it will be inside other component, and the component has the safeAreaView
        <SafeAreaView className={'flex-1 flex-row'}>
            {/*left side View*/}
            <View className={'basis-1/3 bg-cyan-400'}></View>
            {/*right side View*/}
            <View className={'basis-2/3 bg-amber-200'}><Text>aaaaaa</Text></View>
        </SafeAreaView>
        // <SafeAreaView style={styles.container}>
        //     <View style={styles.view1}>
        //         {/* Content of View 1 */}
        //     </View>
        //     <View style={styles.view2}>
        //         {/* Content of View 2 */}
        //     </View>
        // </SafeAreaView>
    )



}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Arrange views horizontally
        flex: 1, // Take up the full available space horizontally
    },
    view1: {
        flex: 3, // View 1 occupies 30% of the available space
        backgroundColor: 'gray', // Background color of View 1
    },
    view2: {
        flex: 7, // View 2 occupies 70% of the available space
        backgroundColor: 'blue', // Background color of View 2
    },
});