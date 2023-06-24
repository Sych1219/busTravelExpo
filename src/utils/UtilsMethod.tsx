
//input is LoadType output is color string
export const getLoadColor = (load: string): string => {
    switch (load) {
        case 'SEA':
            return 'text-green-500';
        case "SDA":
            return 'text-yellow-500';
        case "LSD":
            return 'text-red-500';
    }
    return 'text-green-500';
}

export function formatCountdown(countdown: number): string {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    if (minutes < 1) {
        return "Arr";
    }

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

export function getBusType(busType: string): string {
    switch (busType) {
        case 'SD':
            return "single deck";
        case 'DD':
            return "double deck";
        case 'BD':
            return "bendy";
    }
    return "";
}
