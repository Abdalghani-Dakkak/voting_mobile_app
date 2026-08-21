import { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, User, HelpCircle, Lock, CheckCircle2, LogOut, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../src/context/AuthContext';

export default function Signup() {
  const router = useRouter();
  const { isConnected, userAddress, connectWallet, disconnect } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const formatAddress = (addr) => (addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '');

  const handleConnect = async () => {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 600));
    await connectWallet('User');
    setConnecting(false);
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    await disconnect();
    setDisconnecting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-4">
        <View className="flex-row items-center gap-3 mb-8">
          <View className="p-1 rounded-xl">
            <Image source={require('../assets/images/logo.png')} className="h-9 w-9" resizeMode="contain" />
          </View>
          <Text className="text-2xl font-bold tracking-tight text-brand-navy">QuickVote</Text>
        </View>

        <View className="w-full max-w-[440px] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <View className="h-40 relative overflow-hidden">
            <LinearGradient
              colors={['#1e293b', '#334155', '#0f172a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          </View>

          <View className="px-8 pb-8 -mt-10">
            <View className="items-center w-full">
              <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mb-5">
                <View className="bg-[#EBF1FF] w-10 h-10 rounded-full items-center justify-center">
                  {!isConnected ? <Wallet size={20} color="#1D58E9" /> : <User size={20} color="#1D58E9" />}
                </View>
              </View>
            </View>

            <View className="items-center mb-2">
              <Text className="text-[22px] font-bold text-brand-navy mb-3 text-center">
                {!isConnected ? 'Connect Your Wallet' : 'Dashboard Profile'}
              </Text>
              <Text className="text-slateText text-[15px] leading-relaxed mb-8 text-center px-2">
                {!isConnected
                  ? 'Connect your wallet securely to participate in the upcoming voting session.'
                  : 'Welcome to quick voting system'}
              </Text>
            </View>

            {!isConnected ? (
              <Pressable
                onPress={handleConnect}
                disabled={connecting}
                className="w-full bg-brand-blue active:bg-brand-blueDark rounded-xl py-3.5 px-4 flex-row items-center justify-center gap-3 shadow-sm"
              >
                {connecting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Wallet size={18} color="#fff" />
                )}
                <Text className="text-white font-semibold text-[15px]">
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Text>
              </Pressable>
            ) : (
              <View>
                <View className="w-full bg-bg-panel border border-slate-100 rounded-xl py-2.5 px-4 flex-row items-center justify-center gap-2 mb-6">
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text className="text-[13px] font-medium text-slate-600">
                    Wallet: <Text className="font-mono">{formatAddress(userAddress)}</Text>
                  </Text>
                </View>

                <Pressable
                  onPress={handleDisconnect}
                  disabled={disconnecting}
                  className="w-full bg-rose-50 active:bg-rose-100 rounded-xl py-3.5 px-4 flex-row items-center justify-center gap-2 mb-3"
                >
                  <LogOut size={16} color="#e11d48" />
                  <Text className="text-rose-600 font-semibold text-[15px]">
                    {disconnecting ? 'Disconnecting...' : 'Log Out'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/poll-list')}
                  className="w-full bg-brand-blue active:bg-brand-blueDark rounded-xl py-3.5 px-4 flex-row items-center justify-center gap-2 shadow-sm"
                >
                  <Text className="text-white font-semibold text-[15px]">Continue</Text>
                  <ArrowRight size={16} color="#fff" />
                </Pressable>
              </View>
            )}
          </View>

          {!isConnected && (
            <View className="bg-bg-panel border-t border-slate-100 px-8 py-5">
              <Text className="text-[12px] text-slate-400 text-center leading-relaxed">
                By connecting, you agree to our{' '}
                <Text className="underline">Terms of Service</Text>. We only request view permissions.
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-center gap-6 mt-8">
          <View className="flex-row items-center gap-1.5">
            <HelpCircle size={14} color="#64748B" />
            <Text className="text-slateText text-[13px] font-medium">Need help?</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Lock size={14} color="#64748B" />
            <Text className="text-slateText text-[13px] font-medium">Privacy Policy</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
