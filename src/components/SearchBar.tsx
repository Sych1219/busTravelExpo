import {View, Text, SafeAreaView} from "react-native";
import Test from "@components/Test";
import {GOOGLE_API_KEY} from "@utils/Keys";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import BusRoutes from "@components/BusRoutes";
import {useState} from "react";

const SearchBar = () => {
    const [placeId, setPlaceId] =useState<string>("");
    return (

        <View className={'w-30 h-96 bg-amber-800'}>
            <GooglePlacesAutocomplete styles={{width:5, height: 20}}
                                      placeholder="search here"
                                      onPress={(data, details) => {
                                          // Handle selected place
                                          if(data.place_id && data.place_id.length>0){
                                                console.log("place id is set:", data.place_id);
                                                setPlaceId(data.place_id);
                                          }
                                      }}
                                      fetchDetails
                                      query={{
                                          key: GOOGLE_API_KEY,
                                          language: 'en',
                                      }}
            />
            <BusRoutes destinationPlaceId={placeId}/>
        </View>

    )
}

export default SearchBar;