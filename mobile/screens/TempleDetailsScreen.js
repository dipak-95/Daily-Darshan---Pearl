import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { getDarshan, getTempleById } from '../services/api';
import { API_URL } from '../constants/config';
import { useTheme } from '../context/ThemeContext';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const getImageUrl = (path) => {
    if (!path) return null;

    // API_URL is http://10.234.134.169:5000/api
    const baseUrl = API_URL.replace('/api', '');

    // Fix for images already saved with localhost
    if (path.includes('localhost')) {
        return path.replace('localhost', '10.234.134.169');
    }

    if (path.startsWith('http')) return path;

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${cleanPath}`;
};


const { width } = Dimensions.get('window');

const TempleDetailsScreen = ({ route }) => {
    const { templeId } = route.params;
    const [temple, setTemple] = useState(null);
    const [darshan, setDarshan] = useState([]);
    const [activeTab, setActiveTab] = useState('today'); // 'today' or 'yesterday'
    const [loading, setLoading] = useState(false);

    // Theme Hook
    const { colors, theme } = useTheme();

    useEffect(() => {
        fetchTempleDetails();
    }, []);

    useEffect(() => {
        fetchDarshan();
    }, [activeTab]);

    const fetchTempleDetails = async () => {
        try {
            const { data } = await getTempleById(templeId);
            setTemple(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDarshan = async () => {
        setLoading(true);
        try {
            const { data } = await getDarshan(templeId, activeTab);
            // API returns object with images array if found, or empty
            setDarshan(data.images || []);
        } catch (error) {
            console.error(error);
            setDarshan([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = async (url) => {
        if (!url) return;
        try {
            // 1. Download file to cache
            const filename = url.split('/').pop().split('?')[0] || `darshan_${Date.now()}.jpg`;
            const fileUri = FileSystem.documentDirectory + filename;
            const { uri } = await FileSystem.downloadAsync(url, fileUri);

            // 2. Save to Gallery
            const permission = await MediaLibrary.requestPermissionsAsync(true); // Write-only

            if (permission.status !== 'granted') {
                Alert.alert('Permission Denied', 'Please allow access to save photos.');
                return;
            }

            // Using saveToLibraryAsync (newer API) or createAssetAsync
            await MediaLibrary.createAssetAsync(uri);
            Alert.alert('Success', 'Image saved to Gallery!');

        } catch (error) {
            console.error("Download Error:", error);
            // Fallback to sharing if saving fails
            if (await Sharing.isAvailableAsync()) {
                Alert.alert('Gallery Error', 'Could not save directly. Opening Share options instead.');
                await Sharing.shareAsync(url);
            } else {
                Alert.alert('Download Error', `${error.message}`);
            }
        }
    };

    const shareImage = async (url) => {
        if (!url) return;
        try {
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Error', 'Sharing is not available on this platform');
                return;
            }
            const filename = url.split('/').pop().split('?')[0] || `share_${Date.now()}.jpg`;
            const fileUri = FileSystem.documentDirectory + filename;

            const { uri } = await FileSystem.downloadAsync(url, fileUri);
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Share Error:", error);
            Alert.alert('Error', `Share failed: ${error.message}`);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {temple && (
                <>
                    <Image source={{ uri: temple.image }} style={styles.headerImage} />
                    <View style={styles.headerInfo}>
                        <Text style={[styles.title, { color: colors.text }]}>{temple.name}</Text>
                        <Text style={[styles.subtitle, { color: colors.subText }]}>{temple.location}</Text>
                        <Text style={[styles.desc, { color: colors.text }]}>{temple.description}</Text>
                    </View>
                </>
            )}

            <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'today' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
                    onPress={() => setActiveTab('today')}
                >
                    <Text style={[styles.tabText, { color: colors.subText }, activeTab === 'today' && { color: colors.primary }]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'yesterday' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
                    onPress={() => setActiveTab('yesterday')}
                >
                    <Text style={[styles.tabText, { color: colors.subText }, activeTab === 'yesterday' && { color: colors.primary }]}>Yesterday</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <View style={styles.photosContainer}>
                    {darshan.length > 0 ? (
                        darshan.map((img, index) => (
                            <View key={index} style={[styles.photoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <Image source={{ uri: getImageUrl(img) }} style={styles.darshanImage} resizeMode="contain" />
                                <View style={styles.actions}>
                                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => downloadImage(getImageUrl(img))}>
                                        <Text style={styles.btnText}>Download</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]} onPress={() => shareImage(getImageUrl(img))}>
                                        <Text style={styles.btnText}>Share</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.noData, { color: colors.subText }]}>No Darshan Uploaded Yet</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerImage: {
        width: '100%',
        height: 250,
    },
    headerInfo: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    desc: {
        marginTop: 8,
        lineHeight: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginTop: 16,
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
    },
    photosContainer: {
        padding: 16,
    },
    photoCard: {
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    darshanImage: {
        width: '100%',
        height: 400,
        backgroundColor: '#000',
    },
    actions: {
        flexDirection: 'row',
        padding: 12,
    },
    actionBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    shareBtn: {
        backgroundColor: '#25D366', // WhatsApp Green
        marginRight: 0,
        marginLeft: 8,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noData: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});

export default TempleDetailsScreen;
