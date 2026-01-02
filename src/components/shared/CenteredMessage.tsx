import React from 'react';
import {Text, View} from 'react-native';

type CenteredMessageProps = {
  message?: string;
};

// Simple centered message view to reuse across screens (e.g., loading or empty states).
const CenteredMessage = ({message = 'Loading...'}: CenteredMessageProps) => (
  <View className="flex-1 items-center justify-center">
    <Text className="text-base text-slate-500">{message}</Text>
  </View>
);

export default CenteredMessage;
