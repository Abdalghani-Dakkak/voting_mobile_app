import { View, Text } from 'react-native';

export default function FeatureCard({ icon, title, description }) {
  return (
    <View className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 overflow-hidden">
      <View className="w-14 h-14 rounded-xl bg-slate-900/80 items-center justify-center mb-6 border border-slate-700/50">
        {icon}
      </View>
      <Text className="text-xl font-bold text-white mb-3">{title}</Text>
      <Text className="text-slate-400 leading-relaxed text-sm">{description}</Text>
    </View>
  );
}
