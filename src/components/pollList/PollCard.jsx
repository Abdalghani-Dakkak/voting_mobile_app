import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Timer } from 'lucide-react-native';

const textColor = {
  active: '#1D58E9',
  upcoming: '#1D58E9',
  closed: '#697080',
};

export default function PollCard({ id, status, title, description, voteType, timeRemaining, icon: Icon }) {
  const router = useRouter();

  return (
    <View className="bg-white rounded-[20px] border border-slate-100 overflow-hidden shadow-sm flex-1">
      <View className="h-[140px] relative">
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <View className="flex-1 p-4 flex-row items-start justify-between">
          <View className="bg-[#10B981] flex-row items-center gap-1.5 px-2.5 py-1 rounded-full">
            <View className="w-1.5 h-1.5 rounded-full bg-white" />
            <Text className="text-white text-[11px] font-bold capitalize">{status}</Text>
          </View>
          <View className="bg-[#0B1527]/80 px-2.5 py-1 rounded-full border border-white/10">
            <Text className="text-white/90 text-[11px] font-bold">
              {voteType === 0 ? 'Single Choice' : 'Multiple Choice'}
            </Text>
          </View>
        </View>
        {Icon && (
          <View className="absolute left-4 top-14">
            <Icon size={30} color="#94A3B8" />
          </View>
        )}
        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-[17px] font-bold text-white" numberOfLines={2}>
            {title}
          </Text>
        </View>
      </View>

      <View className="p-5 flex-1">
        <Text className="text-[13px] text-slateText leading-relaxed mb-5" numberOfLines={2}>
          {description}
        </Text>

        <View className="gap-3 mt-auto">
          <View className="bg-bg-panel border border-[#F1F5F9] rounded-xl flex-row items-center gap-2 p-3">
            <Timer size={16} color={textColor[status]} />
            <Text className="text-[12px] font-bold" style={{ color: textColor[status] }}>
              {timeRemaining}
            </Text>
          </View>

          {status === 'active' && (
            <Pressable
              onPress={() => router.push(`/poll/${id}`)}
              className="w-full bg-brand-blue active:bg-brand-blueDark py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-[14px]">Rank & Vote</Text>
            </Pressable>
          )}
          {status === 'upcoming' && (
            <View className="w-full bg-[#F1F5F9] py-3 rounded-xl items-center border border-[#E2E8F0]/50">
              <Text className="text-[#94A3B8] font-bold text-[14px]">Not Started</Text>
            </View>
          )}
          {status === 'closed' && (
            <Pressable
              onPress={() => router.push(`/poll/${id}/results`)}
              className="w-full bg-white border border-[#E2E8F0] active:bg-bg-panel py-3 rounded-xl items-center shadow-sm"
            >
              <Text className="text-brand-navy font-bold text-[14px]">View Results</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
