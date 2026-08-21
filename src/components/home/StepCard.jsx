import { View, Text } from 'react-native';

export default function StepCard({ number, icon, title, desc }) {
  return (
    <View className="items-center px-2">
      <View className="w-16 h-16 rounded-2xl bg-bg-dark border-2 border-slate-800 items-center justify-center mb-5 relative">
        <View className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 border-2 border-bg-dark items-center justify-center">
          <Text className="text-sm font-bold text-white">{number}</Text>
        </View>
        {icon}
      </View>
      <Text className="text-lg font-bold text-white mb-2 text-center">{title}</Text>
      <Text className="text-slate-400 text-sm text-center max-w-[220px]">{desc}</Text>
    </View>
  );
}
