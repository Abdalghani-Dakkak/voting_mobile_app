import { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Trophy, CheckCircle2 } from 'lucide-react-native';
import ScreenLayout from '../../../src/components/layout/ScreenLayout';
import { fetchPollDetails, fetchTallyResult } from '../../../src/api/client';

export default function PollResults() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchWinner = async () => {
      setLoading(true);
      try {
        const pollRes = await fetchPollDetails(id);
        setPoll(pollRes.poll);

        try {
          const tallyRes = await fetchTallyResult(id);
          setWinner(tallyRes.tallyResult?.winnerCandidate?.name || null);
        } catch {
          setWinner(null);
        }
      } catch (err) {
        console.error('Error fetching poll results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWinner();
  }, [id]);

  if (loading) {
    return (
      <ScreenLayout contentClassName="px-5 pt-8 pb-4" bg="bg-[#F8FAFC]">
        <View className="py-20 items-center">
          <ActivityIndicator color="#1D58E9" />
          <Text className="text-slate-500 font-medium mt-3">Loading poll results...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!poll) {
    return (
      <ScreenLayout contentClassName="px-5 pt-8 pb-4" bg="bg-[#F8FAFC]">
        <Text className="text-center py-20 text-slate-500 font-medium">Poll details could not be found.</Text>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout contentClassName="px-5 pt-4 pb-10" bg="bg-[#F8FAFC]">
      <Pressable onPress={() => router.push('/poll-list')} className="flex-row items-center gap-1.5 mb-3">
        <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Polls</Text>
        <Text className="text-slate-300 text-xs">/</Text>
        <Text className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Results</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/poll-list')} className="flex-row items-center gap-2 mb-8">
        <ArrowLeft size={16} color="#64748b" />
        <Text className="text-sm font-medium text-slate-500">Back to Polls</Text>
      </Pressable>

      <View className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 items-center">
        <View className="bg-amber-100 p-4 rounded-full mb-6">
          <Trophy size={40} color="#f59e0b" />
        </View>

        <Text className="text-2xl font-black text-brand-navy tracking-tight mb-4 text-center">{poll.name}</Text>

        {winner ? (
          <View className="items-center gap-2">
            <Text className="text-lg text-slate-500">The winner is</Text>
            <Text className="text-4xl font-black text-emerald-600 tracking-tight text-center">{winner}</Text>
            <View className="mt-6 flex-row items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5">
              <CheckCircle2 size={18} color="#10b981" />
              <Text className="font-bold text-emerald-800">Finalized</Text>
            </View>
          </View>
        ) : (
          <View className="items-center gap-2">
            <Text className="text-xl font-bold text-slate-400">No Winner Yet</Text>
            <Text className="text-slate-500 text-center">
              The poll has not been finalized or no winner could be determined.
            </Text>
          </View>
        )}

        <View className="mt-10 pt-5 border-t border-slate-100 w-full items-center gap-2">
          <Text className="text-xs text-slate-400">Ended: {new Date(poll.endDate).toLocaleDateString()}</Text>
          {poll.createdById && <Text className="text-xs text-slate-400">Created by: {poll.createdById}</Text>}
        </View>
      </View>
    </ScreenLayout>
  );
}
