
//input is LoadType output is color string
export const getLoadColor = (load: string|null): string => {
    if (load === null) {
        return 'text-gray-500'; // Return a default color for null values
    }
    switch (load) {
        case 'SEA':
            return 'text-green-500';
        case "SDA":
            return 'text-yellow-500';
        case "LSD":
            return 'text-red-500';
        default:
            return 'text-green-500'; // Return a default color for unknown values
    }
}

export function formatCountdown(countdown: number|null): string {
    if (countdown === null) {
        return 'Arr';

    }
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

export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
        return str; // No need to truncate
    } else {
        return str.substring(0, maxLength) +".."; // Truncate the string to maxLength characters
    }
}



