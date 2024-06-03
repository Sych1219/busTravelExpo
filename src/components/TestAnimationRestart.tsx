import React, { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';

function TestAnimationRestart() {
    console.log("TestAnimationRestart is called")
    const [busPosition] = useState(new Animated.Value(0));
    const busSVGInfo = {
        cx: 0, // Initial x-coordinate
        cy: 0, // Initial y-coordinate
        nextCx: 100, // Destination x-coordinate
        nextCy: 100, // Destination y-coordinate
    };

    const animateBus = () => {
        // Configure the animation
        Animated.timing(busPosition, {
            toValue: 1, // End value (100% progress)
            duration: 5000, // Duration in milliseconds (adjust as needed)
            useNativeDriver: false, // Set this to true if possible for better performance
        }).start(() => {
            // Animation has completed, reset the busPosition and restart the animation
            busPosition.setValue(0);
            animateBus();
        });
    };

    useEffect(() => {
        // Start the animation when the component mounts
        animateBus();
    }, []);

    return (
        <Animated.View
            style={{
                transform: [
                    {
                        translateX: busPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [busSVGInfo.cx, busSVGInfo.nextCx],
                        }),
                    },
                    {
                        translateY: busPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [busSVGInfo.cy, busSVGInfo.nextCy],
                        }),
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
    );
}

export default TestAnimationRestart;
