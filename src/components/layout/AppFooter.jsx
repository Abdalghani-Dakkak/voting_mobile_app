import { View, Text, Pressable } from 'react-native';

export default function AppFooter() {
  return (
    <View className="px-6 py-5 border-t border-gray-100 flex-col items-center gap-4">
      <Text className="text-sm text-gray-400">© 2026 Quick Voting All rights reserved.</Text>
      <View className="flex-row items-center gap-5 flex-wrap justify-center">
        <Pressable>
          <Text className="text-sm text-gray-400">Privacy Policy</Text>
        </Pressable>
        <Pressable>
          <Text className="text-sm text-gray-400">Terms of Service</Text>
        </Pressable>
        <Pressable>
          <Text className="text-sm text-gray-400">Help Center</Text>
        </Pressable>
      </View>
    </View>
  );
}
