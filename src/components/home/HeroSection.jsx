import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import GradientText from './GradientText';

export default function HeroSection() {
  const router = useRouter();

  return (
    <View className="items-center py-16 pb-20 px-4">
      <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
        <View className="w-2 h-2 rounded-full bg-indigo-500" />
        <Text className="text-indigo-400 text-sm font-medium">Next-Gen Voting Protocol</Text>
      </View>

      <GradientText
        className="text-4xl font-extrabold tracking-tight text-center leading-tight"
        colors={['#818cf8', '#60a5fa', '#22d3ee']}
      >
        {'Secure, Transparent\n& Lightning-Fast Voting'}
      </GradientText>

      <Text className="text-slate-400 text-base leading-relaxed text-center mt-6 max-w-md">
        Empower your community with blockchain-verified elections. Create polls in seconds, vote with
        absolute anonymity, and get verifiable results instantly.
      </Text>

      <View className="w-full gap-4 mt-10">
        <Pressable
          onPress={() => router.push('/signup')}
          className="flex-row items-center justify-center gap-2 px-8 py-4 bg-indigo-600 rounded-xl active:bg-indigo-500 shadow-lg"
        >
          <Text className="text-white text-base font-bold">Get started</Text>
          <ChevronRight size={18} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => router.push('/poll-list')}
          className="flex-row items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl active:bg-white/10"
        >
          <Text className="text-slate-300 text-base font-bold">Explore Polls</Text>
        </Pressable>
      </View>
    </View>
  );
}
