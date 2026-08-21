import { View } from 'react-native';

export default function BackgroundOrbs() {
  return (
    <View className="absolute inset-0" pointerEvents="none">
      <View
        className="absolute rounded-full bg-indigo-600/20"
        style={{ top: -80, left: -80, width: 260, height: 260 }}
      />
      <View
        className="absolute rounded-full bg-blue-600/20"
        style={{ bottom: -60, right: -60, width: 220, height: 220 }}
      />
    </View>
  );
}
