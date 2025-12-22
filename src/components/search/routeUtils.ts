import {Leg, TextValue} from "@components/search/BusRoutes";

export function formatDuration(seconds: number): TextValue {
    if (!Number.isFinite(seconds)) {
        return {text: "—", value: 0};
    }
    const minutes = Math.round(seconds / 60);
    return {text: `${minutes} mins`, value: seconds};
}

export function formatDistance(meters: number): TextValue {
    if (!Number.isFinite(meters)) {
        return {text: "—", value: 0};
    }
    if (meters < 1000) {
        return {text: `${Math.round(meters)} m`, value: meters};
    }
    const km = meters / 1000;
    return {text: `${km.toFixed(1)} km`, value: meters};
}

// Merge multiple legs in a single route-option into one connected itinerary (steps are flattened in-order).
export function mergeLegs(legs: Leg[]): Leg | null {
    if (!legs || legs.length === 0) {
        return null;
    }
    const first = legs[0];
    const last = legs[legs.length - 1];
    const totalDurationSeconds = legs.reduce((sum, leg) => sum + (leg?.duration?.value ?? 0), 0);
    const totalDistanceMeters = legs.reduce((sum, leg) => sum + (leg?.distance?.value ?? 0), 0);
    const steps = legs.flatMap((leg) => leg.steps ?? []);

    return {
        distance: formatDistance(totalDistanceMeters),
        duration: formatDuration(totalDurationSeconds),
        startAddress: first.startAddress,
        startLocation: first.startLocation,
        endAddress: last.endAddress,
        endLocation: last.endLocation,
        steps,
    };
}

