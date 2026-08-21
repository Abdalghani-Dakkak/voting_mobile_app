import { View, Text } from 'react-native';
import { Users, Vote, BarChart3 } from 'lucide-react-native';
import StepCard from './StepCard';

export default function HowItWorks() {
  return (
    <View className="py-16 px-4">
      <View className="items-center mb-14">
        <Text className="text-3xl font-bold text-white mb-3 text-center">How It Works</Text>
        <Text className="text-slate-400 text-center">Three simple steps to secure, verifiable elections.</Text>
      </View>

      <View className="gap-10">
        <StepCard number="1" icon={<Users size={22} color="#818cf8" />} title="Connect & Setup" desc="Link your wallet and define your election parameters in minutes." />
        <StepCard number="2" icon={<Vote size={22} color="#818cf8" />} title="Cast Votes" desc="Eligible participants securely cast their verifiable votes." />
        <StepCard number="3" icon={<BarChart3 size={22} color="#818cf8" />} title="Instantly Tally" desc="View unalterable results instantly as soon as the poll ends." />
      </View>
    </View>
  );
}
