import React, {useState, useEffect} from 'react';
import {View, Animated, Easing} from 'react-native';

const BusAnimation = () => {
    const [busPosition] = useState(new Animated.Value(0));

    useEffect(() => {
        const animationDuration = 5000; // 5 seconds
        // Configure the animation
        Animated.timing(busPosition, {
            toValue: 1, // End value (100% progress)
            duration: animationDuration,
            easing: Easing.linear, // Use linear easing for constant speed
            useNativeDriver: false, // Make sure to set this to false for web-like animations
        }).start(); // Start the animation

        return () => {
            // Clean up animation when component unmounts (not required for React Native)
        };
    }, [busPosition]);

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateX: busPosition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-150, 170], // Adjust the range based on your needs
                                })
                            },
                            {
                                translateY: busPosition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 22], // Adjust the range based on your needs
                                })
                            },
                        ],
                    }}
                >
                    {/* Bus component or image */}
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'red',
                            borderRadius: 10,
                        }}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

export default BusAnimation;
