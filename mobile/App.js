import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Import ThemeProvider

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import TempleDetailsScreen from './screens/TempleDetailsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

const AppContent = () => {
  const { colors, theme } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.headerText,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Daily Darshan',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
                <Ionicons name="settings-outline" size={24} color={colors.headerText} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="TempleDetails"
          component={TempleDetailsScreen}
          options={({ route }) => ({ title: route.params.templeName })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
