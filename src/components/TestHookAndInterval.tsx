import {View, Text} from "react-native";
import {useEffect, useState} from "react";

const TestHookAndInterval = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("count", count)
            setCount(count => count + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <View className={'h-full w-full justify-center items-center'}>
            <Text className={'text-red-800'}>{count}</Text>
        </View>)
}



export default TestHookAndInterval;