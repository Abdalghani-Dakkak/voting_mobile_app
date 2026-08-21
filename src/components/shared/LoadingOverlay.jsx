import { Modal, View, Text, ActivityIndicator } from 'react-native';

export default function LoadingOverlay({ isOpen, label = 'Processing...' }) {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="flex-row items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-lg border border-slate-200">
          <ActivityIndicator color="#2563eb" />
          <Text className="text-sm font-medium text-slate-700">{label}</Text>
        </View>
      </View>
    </Modal>
  );
}
