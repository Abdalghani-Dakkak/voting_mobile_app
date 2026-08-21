import { View, Text } from 'react-native';
import { Calendar, Info } from 'lucide-react-native';

export default function InfoBanner({ startDate, endDate, votingType }) {
  return (
    <View className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8 gap-5">
      <View>
        <View className="flex-row items-center gap-2 mb-2">
          <Calendar size={14} color="#2563eb" />
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-800">{startDate}</Text>
      </View>

      <View className="border-t border-slate-100 pt-5">
        <View className="flex-row items-center gap-2 mb-2">
          <Calendar size={14} color="#2563eb" />
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Date</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-800">{endDate}</Text>
      </View>

      <View className="border-t border-slate-100 pt-5">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-4 h-4 bg-blue-600 rounded-sm items-center justify-center">
            <Text className="text-[10px] font-bold text-white">V</Text>
          </View>
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voting Type</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-slate-800">{votingType}</Text>
          <Info size={14} color="#94a3b8" />
        </View>
      </View>
    </View>
  );
}
