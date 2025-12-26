import {View, Text, ActivityIndicator, ScrollView} from "react-native";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../../screens/SearchScreen";
import {useLocation} from "@utils/CustomerHook";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {busRoutesByStopNameUrl, routesUrl} from "@utils/UrlsUtil";
import {Leg, Route, Step} from "@components/search/BusRoutes";
import {mergeLegs} from "@components/search/routeUtils";
import MapView, {Marker, Polyline} from "react-native-maps";
import polyline from "polyline";
import PagerView from "react-native-pager-view";
import {BusRouteVO} from "@components/search/ListWalkAndStopsView";
import NearbyBusItem, {Service} from "@components/shared/NearbyBusItem";

type ScreenState = 'loading' | 'success' | 'empty' | 'error' | 'needs_location';
type RouteResultsRouteProp = RouteProp<StackParamList, 'RouteResultsView'>;

type StopMarker = {
    busStopCode: string;
    description: string;
    latitude: number;
    longitude: number;
    serviceNo: string;
};

const decodeStepPolyline = (step: Step) => {
    const decoded = polyline.decode(step.polyline.points);
    return decoded.map(([latitude, longitude]) => ({latitude, longitude}));
};

const RouteResultsView = () => {
    const route = useRoute<RouteResultsRouteProp>();
    const {destinationPlaceId, destinationDescription} = route.params;
    const {location, errorMsg} = useLocation();

    const [state, setState] = useState<ScreenState>('loading');
    const [options, setOptions] = useState<Leg[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeLeg = options[activeIndex];

    const [stopMarkers, setStopMarkers] = useState<StopMarker[]>([]);
    const [selectedStop, setSelectedStop] = useState<StopMarker | null>(null);

    useEffect(() => {
        if (!destinationPlaceId || destinationPlaceId.length === 0) {
            setOptions([]);
            setState('empty');
            return;
        }

        if (!location) {
            if (errorMsg) {
                setState('needs_location');
            } else {
                setState('loading');
            }
            return;
        }

        setState('loading');
        const origin = `${location.latitude},${location.longitude}`;
        const destination = `place_id:${destinationPlaceId}`;

        axios
            .get<Route[]>(routesUrl, {params: {origin, destination}})
            .then((response) => {
                const routes = response.data ?? [];
                const merged = routes
                    .map((r) => mergeLegs(r.legs))
                    .filter((leg): leg is Leg => leg != null);

                setOptions(merged);
                setActiveIndex(0);
                setSelectedStop(null);

                if (merged.length === 0) {
                    setState('empty');
                } else {
                    setState('success');
                }
            })
            .catch((e) => {
                console.log("RouteResultsView routes fetch error", e);
                setOptions([]);
                setState('error');
            });
    }, [destinationPlaceId, location, errorMsg]);

    useEffect(() => {
        setStopMarkers([]);
        setSelectedStop(null);

        if (!activeLeg) return;

        const transitSteps = activeLeg.steps.filter((s) => s.travelMode === 'transit' && !!s.busCode);
        if (transitSteps.length === 0) return;

        const fetchStops = async () => {
            try {
                const allSegments: BusRouteVO[][] = [];
                for (const step of transitSteps) {
                    if (!step.departureStop || !step.arrivalStop || !step.busCode) continue;
                    const response = await axios.get<BusRouteVO[]>(busRoutesByStopNameUrl, {
                        params: {
                            departureStop: step.departureStop,
                            arrivalStop: step.arrivalStop,
                            serviceNo: step.busCode,
                        },
                    });
                    allSegments.push(response.data ?? []);
                }

                const flattened = allSegments.flat();
                const seen = new Set<string>();
                const markers: StopMarker[] = [];
                for (const item of flattened) {
                    const code = item.busStopCode;
                    if (!code || seen.has(code)) continue;
                    seen.add(code);
                    markers.push({
                        busStopCode: code,
                        description: item.busStopVO?.description ?? code,
                        latitude: item.busStopVO?.latitude ?? 0,
                        longitude: item.busStopVO?.longitude ?? 0,
                        serviceNo: item.serviceNo,
                    });
                }
                setStopMarkers(markers);
            } catch (e) {
                console.log("RouteResultsView stop fetch error", e);
            }
        };

        void fetchStops();
    }, [activeLeg]);


    const stepPolylines = useMemo(() => {
        if (!activeLeg) return [];
        return activeLeg.steps.map((step, index) => {
            const coords = decodeStepPolyline(step);
            return {
                key: `${index}-${step.travelMode}-${step.busCode ?? 'none'}`,
                coords,
                travelMode: step.travelMode,
            };
        });
    }, [activeLeg]);

    const mapRegion = useMemo(() => {
        if (!activeLeg) return null;
        return {
            latitude: activeLeg.startLocation.lat,
            longitude: activeLeg.startLocation.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        };
    }, [activeLeg]);

    const renderDots = (count: number, active: number) => (
        <View className={'flex-row items-center justify-center py-2'}>
            {Array.from({length: count}).map((_, i) => (
                <View
                    key={i}
                    className={`mx-1 h-2 w-2 rounded-full ${i === active ? 'bg-slate-900' : 'bg-slate-300'}`}
                />
            ))}
        </View>
    );

    const getFirstWalkLabel = (leg: Leg) => {
        const walk = leg.steps.find((s) => s.travelMode === 'walking');
        return walk?.distance?.text ?? '0 m';
    };

    const getFirstTransit = (leg: Leg) => leg.steps.find((s) => s.travelMode === 'transit');

    const getArrivalLabel = (leg: Leg) => {
        const transit = getFirstTransit(leg);
        return transit?.arrivalStop || destinationDescription || 'Destination';
    };

    const getStopsLabel = (stopsCount: number | null | undefined) => {
        if (stopsCount == null) return '';
        return `(${stopsCount} stop${stopsCount === 1 ? '' : 's'})`;
    };

    const selectStop = (stop: StopMarker) => {
        setSelectedStop(stop);
    };

    if (state === 'loading') {
        return (
            <View className={'flex-1 items-center justify-center bg-slate-50'}>
                <ActivityIndicator />
                <Text className={'mt-3 text-sm text-slate-600'}>Finding routes…</Text>
            </View>
        );
    }

    if (state === 'needs_location') {
        return (
            <View className={'flex-1 items-center justify-center bg-slate-50 px-6'}>
                <Text className={'text-base font-bold text-slate-900'}>Location needed</Text>
                <Text className={'mt-2 text-sm text-slate-600 text-center'}>
                    Enable location permission to plan routes from your current position.
                </Text>
            </View>
        );
    }

    if (state === 'error') {
        return (
            <View className={'flex-1 items-center justify-center bg-slate-50 px-6'}>
                <Text className={'text-base font-bold text-slate-900'}>Couldn’t load routes</Text>
                <Text className={'mt-2 text-sm text-slate-600 text-center'}>Please try again.</Text>
            </View>
        );
    }

    if (state === 'empty') {
        return (
            <View className={'flex-1 items-center justify-center bg-slate-50 px-6'}>
                <Text className={'text-base font-bold text-slate-900'}>No routes found</Text>
                <Text className={'mt-2 text-sm text-slate-600 text-center'}>
                    Try another destination or refine your search.
                </Text>
            </View>
        );
    }

    return (
        <View className={'flex-1 bg-slate-50'}>
            <View style={{flex: 0.4}}>
                {mapRegion && (
                    <MapView style={{flex: 1}} initialRegion={mapRegion}>
                        {stepPolylines.map((seg) => (
                            <Polyline
                                key={seg.key}
                                coordinates={seg.coords}
                                strokeWidth={5}
                                strokeColor={seg.travelMode === 'walking' ? 'red' : 'green'}
                                lineDashPattern={seg.travelMode === 'walking' ? [2, 5] : undefined}
                            />
                        ))}

                        {activeLeg && (
                            <>
                                <Marker
                                    coordinate={{latitude: activeLeg.startLocation.lat, longitude: activeLeg.startLocation.lng}}
                                    title={'Start'}
                                    pinColor={'#0f172a'}
                                />
                                <Marker
                                    coordinate={{latitude: activeLeg.endLocation.lat, longitude: activeLeg.endLocation.lng}}
                                    title={'Destination'}
                                    pinColor={'#0f172a'}
                                />
                            </>
                        )}

                        {stopMarkers
                            .filter((m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude) && (m.latitude !== 0 || m.longitude !== 0))
                            .map((m) => {
                                const isSelected = selectedStop?.busStopCode === m.busStopCode;
                                return (
                                    <Marker
                                        key={m.busStopCode}
                                        coordinate={{latitude: m.latitude, longitude: m.longitude}}
                                        title={m.description}
                                        onPress={() => selectStop(m)}
                                    >
                                        <View className={`h-3 w-3 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-slate-900'}`} />
                                    </Marker>
                                );
                            })}
                    </MapView>
                )}
            </View>

            <View className={'bg-white border-t border-slate-200 rounded-t-3xl p-4'} style={{flex: 0.6}}>
                <PagerView
                    style={{flex: 1}}
                    initialPage={0}
                    onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
                >
                {options.map((leg, index) => {
                    const firstTransit = getFirstTransit(leg);
                    const walkLabel = getFirstWalkLabel(leg);
                    const stopsCount = firstTransit?.numStops;
                    const busCode = firstTransit?.busCode;
                    const arrivalLabel = getArrivalLabel(leg);
                    const isRecommended = index === 0;
                    const serviceFromStep = firstTransit?.serviceVO ?? null;
                    const service: Service = serviceFromStep
                        ? {
                            ...serviceFromStep,
                            nextBus: serviceFromStep.nextBus
                                ? {...serviceFromStep.nextBus, destinationCode: serviceFromStep.nextBus.destinationCode ?? arrivalLabel}
                                : null,
                            nextBus2: serviceFromStep.nextBus2
                                ? {...serviceFromStep.nextBus2, destinationCode: serviceFromStep.nextBus2.destinationCode ?? arrivalLabel}
                                : null,
                            nextBus3: serviceFromStep.nextBus3
                                ? {...serviceFromStep.nextBus3, destinationCode: serviceFromStep.nextBus3.destinationCode ?? arrivalLabel}
                                : null,
                        }
                        : {
                            serviceNo: busCode ?? '--',
                            operator: '',
                            nextBus: null,
                            nextBus2: null,
                            nextBus3: null,
                        };
                    const busStopCode = selectedStop?.busStopCode ?? '--';

                    return (
                        <ScrollView key={index} className={'px-1 pb-4'}>
                            <NearbyBusItem
                                busStopCode={busStopCode}
                                service={service}
                                variant={isRecommended ? 'pinned' : 'default'}
                                disableAutoRefresh
                            />

                            <View className={'mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3'}>
                                <View className={'flex-row items-center justify-between'}>
                                    <Text className={'text-xs font-semibold text-slate-700'}>OPTION {index + 1}</Text>
                                    {isRecommended && (
                                        <Text className={'text-xs font-semibold text-amber-600'}>⭐ Recommended</Text>
                                    )}
                                </View>

                                <View className={'mt-3 flex-row items-center'}>
                                    <Text className={'text-sm font-semibold text-slate-800'}>🚶 {walkLabel}</Text>
                                    <Text className={'mx-2 text-sm text-slate-400'}>→</Text>
                                    <Text className={'text-sm font-semibold text-slate-800'}>
                                        🚌 {busCode ?? '--'} {getStopsLabel(stopsCount)}
                                    </Text>
                                </View>

                                <Text className={'mt-4 text-xs text-slate-500'} numberOfLines={1}>
                                    Total time: {leg.duration?.text ?? '--'}
                                </Text>
                            </View>
                        </ScrollView>
                    );
                })}
                </PagerView>

                {renderDots(options.length, activeIndex)}
            </View>
        </View>
    );
};

export default RouteResultsView;
