import { View, Text, Pressable } from 'react-native';

export default function CandidateCard({ candidate, isSelected, toggleSelection, rankIndex }) {
  return (
    <Pressable
      onPress={() => toggleSelection(candidate.id)}
      className={`bg-white rounded-2xl p-5 ${
        isSelected ? 'border-2 border-blue-600' : 'border border-slate-200'
      }`}
      style={isSelected ? { shadowColor: '#2563eb', shadowOpacity: 0.15, shadowRadius: 10 } : undefined}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${candidate.iconBg}`}>
          <candidate.icon size={20} color={candidate.iconColor} />
        </View>

        {isSelected ? (
          <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white font-bold text-sm">{rankIndex}</Text>
          </View>
        ) : (
          <View className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white">
            <Text className="text-slate-700 font-medium text-xs">Rank</Text>
          </View>
        )}
      </View>

      <Text className="font-bold text-lg text-slate-900 mb-1 tracking-tight">{candidate.name}</Text>
      {!!candidate.description && (
        <Text className="text-slate-500 text-sm leading-relaxed">{candidate.description}</Text>
      )}
    </Pressable>
  );
}
