import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {BusStopWithBusesInfoProps} from "../screens/NearbyScreen";

const baseUrl = 'http://localhost:8080/busStop';
const busArrivingInfoUrl = `${baseUrl}/getBusArrivingInfo`;


 interface BusArrivingRequestParams {
    longitude: number;
    latitude: number;
    stopCount: number;
}

export async function fetchBusArrivingInfoData(params: BusArrivingRequestParams): Promise<BusStopWithBusesInfoProps[]> {
    const config: AxiosRequestConfig = {
        params: params,
    };
    try {
        const response: AxiosResponse<BusStopWithBusesInfoProps[]> =
            await axios.get<BusStopWithBusesInfoProps[]>(busArrivingInfoUrl, config);

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}


interface MockData{
    name: string;
    nest: Nest;
}
interface Nest{
    email: string;
    password: string;
}

const testUrl = 'http://localhost:8080/busStop/test';
export async function fetchMockData(): Promise<MockData> {

    try {
        const response: AxiosResponse<MockData> =
            await axios.get<MockData>(testUrl);
        console.log("response.Mockdata", JSON.stringify( response.data))
        console.log(JSON.stringify(response.data, null, 2));

        return  response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}
