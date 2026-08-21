import { Modal, View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

export default function Popup({ isOpen, onClose, title, message, action, confirmDelete, isAlert = false }) {
  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-slate-100">
            {title ? <Text className="font-semibold text-lg text-slate-800">{title}</Text> : <View />}
            <Pressable onPress={onClose} className="p-1 rounded-md active:bg-slate-100">
              <X size={20} color="#94a3b8" />
            </Pressable>
          </View>
          <View className="p-6">
            <Text className="text-slate-600 mb-6">{message}</Text>
            <View className="flex-row justify-end gap-3">
              {!isAlert && (
                <Pressable onPress={onClose} className="px-4 py-2 border border-slate-200 rounded-lg active:bg-slate-50">
                  <Text className="text-slate-700 font-medium">Cancel</Text>
                </Pressable>
              )}
              <Pressable
                onPress={isAlert ? onClose : confirmDelete}
                className={`px-4 py-2 rounded-lg ${isAlert ? 'bg-blue-600 active:bg-blue-700' : 'bg-rose-600 active:bg-rose-700'}`}
              >
                <Text className="text-white font-medium">{isAlert ? 'OK' : action}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
