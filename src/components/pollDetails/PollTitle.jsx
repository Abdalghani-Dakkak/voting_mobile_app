import { View, Text } from 'react-native';

export default function PollTitle({ title, desc }) {
  return (
    <View className="mb-6">
      <Text className="text-3xl font-black text-brand-navy tracking-tight mb-3">{title}</Text>
      <Text className="text-slateText text-base leading-relaxed">{desc}</Text>
    </View>
  );
}
