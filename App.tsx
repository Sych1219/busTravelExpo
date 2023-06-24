import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Test from "./src/components/Test";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className={'text-red-500'}>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Test/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
