import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default function ScreenLayout({ children, bg = 'bg-bg-light', scroll = true, contentClassName = '' }) {
  return (
    <SafeAreaView edges={['top']} className={`flex-1 ${bg}`}>
      <AppHeader />
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName}
          keyboardShouldPersistTaps="handled"
        >
          {children}
          <AppFooter />
        </ScrollView>
      ) : (
        <View className={`flex-1 ${contentClassName}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
