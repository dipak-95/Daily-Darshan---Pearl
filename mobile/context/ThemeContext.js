import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState(systemScheme === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
        } catch (e) {
            console.log('Failed to load theme');
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('appTheme', newTheme);
    };

    const colors = theme === 'light' ? {
        background: '#f8f9fa',
        card: '#ffffff',
        text: '#333333',
        subText: '#666666',
        primary: '#f97316',
        border: '#eeeeee',
        headerText: '#ffffff'
    } : {
        background: '#121212',
        card: '#1e1e1e',
        text: '#e0e0e0',
        subText: '#aaaaaa',
        primary: '#f97316',
        border: '#333333',
        headerText: '#ffffff'
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
