import {View, Text, SafeAreaView, TouchableOpacity, FlatList} from "react-native";
import {GOOGLE_API_KEY} from "@utils/Keys";
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from "react-native-google-places-autocomplete";
import {useMemo, useRef, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParamList} from "../../screens/SearchScreen";

const SearchView = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'SearchView'>>();
    const placesRef = useRef<GooglePlacesAutocompleteRef>(null);
    const [recentPlaces, setRecentPlaces] = useState<Array<{description: string; placeId: string}>>([]);

    type PopularSuggestion = {label: string; query: string; placeId?: string};
    const popularSuggestions = useMemo(
        (): PopularSuggestion[] => [
            {label: "Changi Airport", query: "Changi Airport", placeId: "ChIJ483Qk9YX2jERA0VOQV7d1tY"},
            {label: "Orchard Road", query: "Orchard Road", placeId: "ChIJu_7mSJEZ2jER-vT-Nz_3mY4"},
            {label: "Bugis", query: "Bugis", placeId: "ChIJj7TW9LoZ2jERQgNlXkKhASQ"},
            {label: "Marina Bay Sands", query: "Marina Bay Sands", placeId: "ChIJA5LATO4Z2jER111V-v6abAI"},
        ],
        []
    );

    const onDestinationSelected = (description: string, placeId: string) => {
        if (!placeId) return;
        setRecentPlaces((prev) => {
            const withoutDup = prev.filter((p) => p.placeId !== placeId);
            return [{description, placeId}, ...withoutDup].slice(0, 6);
        });
        navigation.navigate('RouteResultsView', {destinationPlaceId: placeId, destinationDescription: description});
    };
    return (

        <SafeAreaView className={'w-full h-full bg-slate-50'}>
            <FlatList
                data={[]}
                renderItem={() => null}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: 24}}
                ListHeaderComponent={
                    <>
                        <View className={'px-6 pt-4'}>
                            <Text className={'text-3xl font-extrabold text-slate-900'}>Where to?</Text>
                            <Text className={'mt-1 text-sm text-slate-500'}>Search a destination to see routes</Text>
                        </View>

                        <View className={'mt-4'}>
                            <GooglePlacesAutocomplete
                                ref={placesRef}
                                styles={{
                                    container: {
                                        paddingHorizontal: 24,
                                    },
                                    textInputContainer: {
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        paddingHorizontal: 8,
                                    },
                                }}
                                placeholder="search here"
                                onPress={(data, details) => {
                                    const placeId = data.place_id ?? "";
                                    const description = (data.description as string) ?? "Destination";
                                    if (placeId.length > 0) {
                                        onDestinationSelected(description, placeId);
                                    }
                                }}
                                fetchDetails
                                query={{
                                    key: GOOGLE_API_KEY,
                                    language: 'en',
                                    components: 'country:sg'
                                }}
                            />
                        </View>

                        <View className={'mt-6 px-6'}>
                            <Text className={'text-base font-bold text-slate-900'}>Recommended</Text>

                            {recentPlaces.length > 0 && (
                                <View className={'mt-3'}>
                                    <Text className={'text-xs font-semibold text-slate-500'}>Recent</Text>
                                    <View className={'mt-2 space-y-2'}>
                                        {recentPlaces.map((p) => (
                                            <TouchableOpacity
                                                key={p.placeId}
                                                className={'rounded-xl bg-white px-4 py-3 border border-slate-200'}
                                                onPress={() => onDestinationSelected(p.description, p.placeId)}
                                            >
                                                <Text className={'text-sm font-semibold text-slate-900'} numberOfLines={1}>
                                                    {p.description}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View className={'mt-4'}>
                                <Text className={'text-xs font-semibold text-slate-500'}>Popular</Text>
                                <View className={'mt-2 flex-row flex-wrap'}>
                                    {popularSuggestions.map((item) => (
                                        <TouchableOpacity
                                            key={item.label}
                                            className={'mr-2 mb-2 rounded-full bg-white px-4 py-2 border border-slate-200'}
                                            onPress={() => {
                                                placesRef.current?.setAddressText(item.query);
                                                if (item.placeId && item.placeId.length > 0) onDestinationSelected(item.label, item.placeId);
                                            }}
                                        >
                                            <Text className={'text-xs font-semibold text-slate-700'}>{item.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>


    )
}

export default SearchView;
