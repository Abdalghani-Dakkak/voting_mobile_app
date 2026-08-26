import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Image, BackHandler } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { X, Home, Vote, User, Wallet, FilePlus } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 280;

export default function NavDrawer({ visible, onClose }) {
  const [mounted, setMounted] = useState(visible);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, userRole, userAddress } = useAuth();

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 240, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -DRAWER_WIDTH, duration: 200, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible]);

  if (!mounted) return null;

  const go = (path) => {
    onClose();
    router.push(path);
  };

  const formatAddress = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');

  const links = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Polls', path: '/poll-list', icon: Vote },
    ...(userRole === 'Organization' ? [{ label: 'Create Poll', path: '/create-poll', icon: FilePlus }] : []),
    {
      label: isConnected ? 'Profile' : 'Connect Wallet',
      path: isConnected ? '/profile' : '/signup',
      icon: isConnected ? User : Wallet,
    },
  ];

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', zIndex: 100 }}
    >
      <Animated.View
        style={{
          width: DRAWER_WIDTH,
          height: '100%',
          transform: [{ translateX }],
          backgroundColor: '#ffffff',
          paddingTop: 56,
          paddingHorizontal: 20,
        }}
        className="shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center gap-2">
            <View className="w-7 h-7 bg-brand-blue rounded items-center justify-center overflow-hidden">
              <Image source={require('../../../assets/images/logo.png')} className="w-6 h-6" resizeMode="contain" />
            </View>
            <Text className="text-slate-900 font-bold text-lg">Quick</Text>
          </View>
          <Pressable onPress={onClose} className="p-2 -mr-2">
            <X size={22} color="#475569" />
          </Pressable>
        </View>

        {isConnected && (
          <View className="mb-6 bg-bg-panel border border-slate-100 rounded-xl px-3 py-2.5">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{userRole}</Text>
            <Text className="text-[13px] font-mono text-slate-600 mt-0.5">{formatAddress(userAddress)}</Text>
          </View>
        )}

        <View className="gap-1">
          {links.map((link) => {
            const active = pathname === link.path;
            const Icon = link.icon;
            return (
              <Pressable
                key={link.path}
                onPress={() => go(link.path)}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-xl ${active ? 'bg-[#EBF1FF]' : ''}`}
              >
                <Icon size={19} color={active ? '#1D58E9' : '#475569'} />
                <Text className={`text-[15px] font-semibold ${active ? 'text-brand-blue' : 'text-slate-700'}`}>
                  {link.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <Animated.View
          style={{ flex: 1, opacity: backdropOpacity, backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
        />
      </Pressable>
    </View>
  );
}
