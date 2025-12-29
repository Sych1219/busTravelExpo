import {TextValue} from "@components/search/BusRoutes";

export function formatDuration(seconds: number): TextValue {
    if (!Number.isFinite(seconds)) {
        return {text: "—", value: 0};
    }
    const minutes = Math.round(seconds / 60);
    return {text: `${minutes} mins`, value: seconds};
}


