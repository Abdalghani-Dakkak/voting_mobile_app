import { View, Text } from 'react-native';

export default function SectionHeader({ icon: Icon, title, badge, iconColor }) {
  return (
    <View className="flex-row items-center gap-3 mb-4">
      <View className="flex-row items-center gap-2">
        <Icon size={18} color={iconColor} />
        <Text className="text-[17px] font-bold text-brand-navy">{title}</Text>
      </View>
      {badge && (
        <View className="bg-[#EBF1FF] px-2.5 py-1 rounded-full border border-[#D1E0FF]/50">
          <Text className="text-[11px] font-bold text-brand-blue">{badge}</Text>
        </View>
      )}
    </View>
  );
}
