import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Web3AuthProvider } from '@web3auth/react-native-sdk';
import { web3AuthConfig } from '../src/config/web3auth';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Web3AuthProvider webBrowser={WebBrowser} storage={SecureStore} config={web3AuthConfig}>
          <AuthProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="poll-list" />
              <Stack.Screen name="poll/[id]/index" />
              <Stack.Screen name="poll/[id]/results" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="create-poll" />
            </Stack>
          </AuthProvider>
        </Web3AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
