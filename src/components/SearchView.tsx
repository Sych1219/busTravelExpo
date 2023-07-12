import {View, Text, SafeAreaView, TextInput, Button} from "react-native";
import Test from "@components/Test";
import {GOOGLE_API_KEY} from "@utils/Keys";
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from "react-native-google-places-autocomplete";
import BusRoutes from "@components/BusRoutes";
import {useRef, useState} from "react";

const SearchView = () => {
    const [placeId, setPlaceId] = useState<string>("");
    return (

        <View className={'w-full h-full flex-col space-x-1'}>
            <GooglePlacesAutocomplete
                styles={{
                    container: {
                        paddingTop: 45,
                        paddingHorizontal: 32, // Add desired horizontal padding
                    },
                    textInputContainer: {
                        backgroundColor: 'white',
                        borderRadius: 10,
                        paddingHorizontal: 8, // Adjust horizontal padding as needed
                    },
                }}
                placeholder="search here"
                onPress={(data, details) => {
                    // Handle selected place
                    if (data.place_id && data.place_id.length > 0) {
                        console.log("place id is set:", data.place_id);
                        setPlaceId(data.place_id);
                    }
                }}
                fetchDetails
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                    components: 'country:sg'
                }}
            />
            <BusRoutes destinationPlaceId={placeId}/>
        </View>


    )
}

export default SearchView;