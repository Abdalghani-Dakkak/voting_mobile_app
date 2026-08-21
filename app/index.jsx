import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundOrbs from '../src/components/home/BackgroundOrbs';
import HeroSection from '../src/components/home/HeroSection';
import FeaturesSection from '../src/components/home/FeaturesSection';
import HowItWorks from '../src/components/home/HowItWorks';
import BottomCTA from '../src/components/home/BottomCTA';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-bg-dark" edges={['top']}>
      <View className="flex-1">
        <BackgroundOrbs />
        <ScrollView className="flex-1" contentContainerClassName="pb-6">
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
          <BottomCTA />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
