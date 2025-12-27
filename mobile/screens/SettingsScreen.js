import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
    const { theme, toggleTheme, colors } = useTheme();

    const sections = [
        {
            title: 'Appearance',
            items: [
                {
                    id: 'darkMode',
                    icon: 'moon-outline',
                    label: 'Dark Mode',
                    type: 'toggle',
                    value: theme === 'dark',
                    onPress: toggleTheme
                }
            ]
        },
        {
            title: 'Information',
            items: [
                {
                    id: 'privacy',
                    icon: 'shield-checkmark-outline',
                    label: 'Privacy Policy',
                    type: 'link',
                    onPress: () => Alert.alert('Privacy Policy', 'This app respects your privacy. No personal data is collected.')
                },
                {
                    id: 'about',
                    icon: 'information-circle-outline',
                    label: 'About & Version',
                    type: 'link',
                    onPress: () => Alert.alert('About', 'Daily Darshan App\nVersion 1.0.0\nBuilt with Expo & React Native')
                }
            ]
        }
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {sections.map((section, index) => (
                <View key={index} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.subText }]}>{section.title}</Text>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        {section.items.map((item, idx) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.item,
                                    idx !== section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                                ]}
                                onPress={item.type === 'link' ? item.onPress : undefined}
                                activeOpacity={item.type === 'link' ? 0.7 : 1}
                            >
                                <View style={styles.itemLeft}>
                                    <Ionicons name={item.icon} size={22} color={colors.text} style={styles.icon} />
                                    <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
                                </View>
                                {item.type === 'toggle' ? (
                                    <Switch
                                        value={item.value}
                                        onValueChange={item.onPress}
                                        trackColor={{ false: '#767577', true: colors.primary }}
                                        thumbColor={item.value ? '#fff' : '#f4f3f4'}
                                    />
                                ) : (
                                    <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.subText }]}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    footerText: {
        fontSize: 12,
    }
});

export default SettingsScreen;
