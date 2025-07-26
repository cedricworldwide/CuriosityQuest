import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/components/DashboardScreen.js';
import TopicDetailScreen from './src/components/TopicDetailScreen.js';
import LoginScreen from './src/components/LoginScreen.js';
import SignupScreen from './src/components/SignupScreen.js';
import { AuthProvider } from './src/contexts/AuthContext.js';
import { TranslationProvider } from './src/contexts/TranslationContext.js';
import { useTranslation } from './src/contexts/TranslationContext.js';

const Stack = createNativeStackNavigator();

// A wrapper component to use translation within screen options
function AppNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DashboardScreen} options={{ title: t('appTitle') }} />
      <Stack.Screen name="Topic" component={TopicDetailScreen} options={{ title: t('exploreMore') }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: t('signup') }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TranslationProvider>
    </AuthProvider>
  );
}