import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientText({ children, className, colors = ['#818cf8', '#60a5fa', '#22d3ee'] }) {
  return (
    <MaskedView maskElement={<Text className={className}>{children}</Text>}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text className={`${className} opacity-0`}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
