import { View, Text } from 'react-native';

export default function ProfileHeader() {
  return (
    <View className="mb-8 gap-3">
      <Text className="text-[24px] tracking-tight font-extrabold text-brand-navy">Profile</Text>
      <Text className="text-[14px] text-slateText leading-relaxed">
        Manage your identity, and update your profile details. Your secure gateway to a personalized voting
        experience.
      </Text>
    </View>
  );
}
