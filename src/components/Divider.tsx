import {View} from "react-native";

interface DividerProps {
    height: number;
    color: string;

}

const Divider = ({height, color}: DividerProps) => {
    return (
        <View
            style={{
                height: height,
                borderBottomWidth: 1,
                borderBottomColor: color,
                marginVertical: 1,
                marginTop: 5,
            }}
        />
    )
}

export default Divider;
