import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { getTemples } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { colors, theme } = useTheme();

    useEffect(() => {
        fetchTemples();
    }, []);

    const fetchTemples = async () => {
        try {
            setError(null);
            const { data } = await getTemples();
            setTemples(data);
        } catch (error) {
            console.error("Fetch Error:", error);
            setError('Unable to connect to server. Check your internet connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchTemples();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, shadowColor: theme === 'dark' ? '#000' : '#ccc' }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TempleDetails', { templeId: item._id, templeName: item.name })}
        >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.location}>{item.location}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>View Darshan</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.subText }]}>Loading Temples...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={styles.errorText}>⚠️</Text>
                <Text style={[styles.errorMessage, { color: colors.text }]}>{error}</Text>
                <TouchableOpacity onPress={fetchTemples} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
            <FlatList
                data={temples}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.subText }]}>No Temples Found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    list: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        height: 250,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: '#fbbf24', // Amber-400
        fontWeight: '500',
    },
    badge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginLeft: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 40,
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryBtn: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
    }
});

export default HomeScreen;
