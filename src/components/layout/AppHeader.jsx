import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Menu, X } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, userRole, userAddress } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const formatAddress = (loggedIn) => {
    if (!loggedIn) return 'Connect Wallet';
    return userAddress ? `${userAddress.slice(0, 4)}...${userAddress.slice(-4)}` : 'Profile';
  };

  const go = (path) => {
    setMenuOpen(false);
    router.push(path);
  };

  const NavLink = ({ label, path }) => (
    <Pressable onPress={() => go(path)} className="py-2">
      <Text
        className={`text-[15px] font-medium ${
          pathname === path ? 'text-slate-900 font-bold' : 'text-slate-600'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="bg-white px-5 py-4 flex-row items-center justify-between border-b border-slate-50 z-40">
      <Pressable onPress={() => go('/poll-list')} className="flex-row items-center gap-2">
        <View className="w-7 h-7 bg-brand-blue rounded items-center justify-center overflow-hidden">
          <Image source={require('../../../assets/images/logo.png')} className="w-6 h-6" resizeMode="contain" />
        </View>
        <Text className="text-slate-900 font-bold text-lg">Quick</Text>
      </Pressable>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => go(isConnected ? '/profile' : '/signup')}
          className="bg-brand-blue active:bg-brand-blueDark px-3.5 py-2.5 rounded-xl shadow-sm"
        >
          <Text className="text-white text-[13px] font-semibold">{formatAddress(isConnected)}</Text>
        </Pressable>

        <Pressable
          onPress={() => setMenuOpen((v) => !v)}
          className="p-2 border border-slate-100 rounded-lg items-center justify-center shadow-sm"
        >
          {menuOpen ? <X size={20} color="#475569" /> : <Menu size={20} color="#475569" />}
        </Pressable>
      </View>

      {menuOpen && (
        <View className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-4 z-50">
          <NavLink label="Polls" path="/poll-list" />
          {userRole === 'Organization' && <NavLink label="Create Poll" path="/create-poll" />}
          <NavLink label={isConnected ? 'Profile' : 'Connect Wallet'} path={isConnected ? '/profile' : '/signup'} />
        </View>
      )}
    </View>
  );
}
