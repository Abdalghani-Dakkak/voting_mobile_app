import { View, Text } from 'react-native';
import { ShieldCheck, Settings } from 'lucide-react-native';
import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
  return (
    <View className="py-16 border-t border-slate-800/50 px-4">
      <View className="items-center mb-12">
        <Text className="text-3xl font-bold text-white mb-3 text-center">Why choose Quick-voting?</Text>
        <Text className="text-slate-400 text-base text-center max-w-md">
          Built from the ground up to provide the most reliable and user-friendly voting experience.
        </Text>
      </View>

      <View className="gap-5">
        <FeatureCard
          icon={<ShieldCheck size={28} color="#34d399" />}
          title="End-to-End Security"
          description="Cryptographically secured votes ensuring your election integrity cannot be compromised."
        />
        <FeatureCard
          icon={<Settings size={28} color="#60a5fa" />}
          title="Total Customization"
          description="Set specific rules, closing times, and allowed voter lists with a few clicks."
        />
      </View>
    </View>
  );
}
