import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {BusStopWithBusesInfoProps} from "../screens/NearbyScreen";

const baseUrl = 'http://localhost:8080/busStop';
const busArrivingInfoUrl = `${baseUrl}/getBusArrivingInfo`;


 interface BusArrivingRequestParams {
    longitude: number;
    latitude: number;
    stopCount: number;
}

//the method is use axios to fetch data from backend, return BusStopWithBusesInfoProps[]
// const fetchData = async (params: BusArrivingRequestParams) => {
//         const config: AxiosRequestConfig = {
//         params: params,
//     };
//     try {
//         const response = await axios.get<BusStopWithBusesInfoProps[]>(busArrivingInfoUrl, config);
//         const busStopWithBusesInfoProps: BusStopWithBusesInfoProps[] = response.data;
//         console.log("busStopWithBusesInfoProps",busStopWithBusesInfoProps); // Use the parsed data as needed
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };
//
// fetchData({longitude: 1, latitude: 1, stopCount: 1});
// export default fethData;
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
