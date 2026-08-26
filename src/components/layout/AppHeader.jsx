import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import NavDrawer from './NavDrawer';

export default function AppHeader() {
  const router = useRouter();
  const { isConnected, userAddress } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const formatAddress = (loggedIn) => {
    if (!loggedIn) return 'Connect Wallet';
    return userAddress ? `${userAddress.slice(0, 4)}...${userAddress.slice(-4)}` : 'Profile';
  };

  return (
    <>
      <View className="bg-white px-5 py-4 flex-row items-center justify-between border-b border-slate-50 z-40">
        <Pressable onPress={() => router.push('/poll-list')} className="flex-row items-center gap-2">
          <View className="w-7 h-7 bg-brand-blue rounded items-center justify-center overflow-hidden">
            <Image source={require('../../../assets/images/logo.png')} className="w-6 h-6" resizeMode="contain" />
          </View>
          <Text className="text-slate-900 font-bold text-lg">Quick</Text>
        </Pressable>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push(isConnected ? '/profile' : '/signup')}
            className="bg-brand-blue active:bg-brand-blueDark px-3.5 py-2.5 rounded-xl shadow-sm"
          >
            <Text className="text-white text-[13px] font-semibold">{formatAddress(isConnected)}</Text>
          </Pressable>

          <Pressable
            onPress={() => setDrawerOpen(true)}
            className="p-2 border border-slate-100 rounded-lg items-center justify-center shadow-sm"
          >
            <Menu size={20} color="#475569" />
          </Pressable>
        </View>
      </View>

      <NavDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
