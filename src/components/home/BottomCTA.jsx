import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

export default function BottomCTA() {
  const router = useRouter();

  return (
    <View className="mx-4 mt-6 mb-10 py-12 px-6 rounded-3xl overflow-hidden border border-indigo-500/20 bg-indigo-950/40">
      <View className="items-center max-w-md mx-auto">
        <Text className="text-2xl font-bold text-white mb-3 text-center">
          Ready to host your first election?
        </Text>
        <Text className="text-indigo-200/80 mb-8 text-base text-center">
          Join thousands of communities trusting Quick-voting with their most important decisions.
        </Text>
        <View className="w-full gap-4">
          <Pressable
            onPress={() => router.push('/signup')}
            className="flex-row items-center justify-center gap-2 px-8 py-4 bg-white rounded-xl active:bg-indigo-50"
          >
            <Text className="text-indigo-950 text-base font-bold">Get Started Now</Text>
            <ChevronRight size={18} color="#1e1b4b" />
          </Pressable>
          <Pressable className="flex-row items-center justify-center gap-2 px-8 py-4 bg-indigo-600/50 rounded-xl border border-indigo-400/30 active:bg-indigo-600">
            <Text className="text-white text-base font-bold">Apply as an Organization</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
