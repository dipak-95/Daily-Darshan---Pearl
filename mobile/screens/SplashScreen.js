import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(1500),
        ]).start(() => {
            navigation.replace('Home');
        });
    }, [fadeAnim, navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Text style={styles.logoText}>Daily Darshan</Text>
                <Text style={styles.subText}>Pearl</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF9933', // Saffron color
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 2,
    },
    subText: {
        fontSize: 20,
        color: 'white',
        marginTop: 10,
    },
});

export default SplashScreen;
