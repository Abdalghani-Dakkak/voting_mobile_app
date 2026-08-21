import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Zap, Clock, CheckCircle2, Rocket, BarChart3, RefreshCw } from 'lucide-react-native';
import ScreenLayout from '../src/components/layout/ScreenLayout';
import PollCard from '../src/components/pollList/PollCard';
import SectionHeader from '../src/components/pollList/SectionHeader';
import { fetchPolls, fetchCandidates } from '../src/api/client';

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const enrichWithCandidates = useCallback(async (pollsData) => {
    return Promise.all(
      pollsData.map(async (poll) => {
        try {
          const candRes = await fetchCandidates({ pollId: poll.id });
          return { ...poll, candidateNames: (candRes.candidates || []).map((c) => c.name) };
        } catch {
          return { ...poll, candidateNames: [] };
        }
      })
    );
  }, []);

  const fetchAllPolls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchPolls({ limit: '100' });
      const data = res.data || [];
      const enriched = await enrichWithCandidates(data);
      setPolls(enriched);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  }, [enrichWithCandidates]);

  useEffect(() => {
    fetchAllPolls();
  }, [fetchAllPolls]);

  const now = Date.now();
  const toMs = (iso) => new Date(iso).getTime();
  const activePolls = polls.filter((p) => now >= toMs(p.startDate) && now <= toMs(p.endDate));
  const upcomingPolls = polls.filter((p) => now < toMs(p.startDate));
  const closedPolls = polls.filter((p) => now > toMs(p.endDate));

  const formatDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const describe = (poll) => poll.description || `Candidates: ${poll.candidateNames.join(', ') || poll.candidateCount + ' candidates'}`;

  return (
    <ScreenLayout contentClassName="px-5 pt-8 pb-4">
      <View className="mb-8 gap-3">
        <Text className="text-[24px] tracking-tight font-extrabold text-brand-navy">Voting Rounds</Text>
        <Text className="text-[14px] text-slateText leading-relaxed">
          Participate in community decisions. Rank your preferences on active proposals or view past results.
        </Text>
        <Pressable
          onPress={fetchAllPolls}
          disabled={loading}
          className={`self-start flex-row items-center gap-2 rounded-xl border px-4 py-2 mt-1 ${
            loading ? 'border-slate-200 bg-slate-100' : 'border-slate-200 bg-white active:bg-slate-50'
          }`}
        >
          {loading ? <ActivityIndicator size="small" color="#94a3b8" /> : <RefreshCw size={16} color="#334155" />}
          <Text className={`text-sm font-semibold ${loading ? 'text-slate-400' : 'text-slate-700'}`}>Refresh Polls</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color="#1D58E9" />
          <Text className="text-slateText mt-3">Loading polls...</Text>
        </View>
      ) : (
        <View className="gap-10">
          <View>
            <SectionHeader icon={Zap} title="Active Polls" badge={`${activePolls.length} Active`} iconColor="#1D58E9" />
            <View className="gap-5">
              {activePolls.length > 0 ? (
                activePolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    id={poll.id}
                    status="active"
                    title={poll.name}
                    voteType={poll.voteType}
                    description={describe(poll)}
                    timeRemaining={`Ends ${formatDate(poll.endDate)}`}
                  />
                ))
              ) : (
                <Text className="text-slateText text-sm">No active polls found.</Text>
              )}
            </View>
          </View>

          <View>
            <SectionHeader icon={Clock} title="Upcoming Polls" iconColor="#64748B" />
            <View className="gap-5">
              {upcomingPolls.length > 0 ? (
                upcomingPolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    id={poll.id}
                    status="upcoming"
                    icon={Rocket}
                    voteType={poll.voteType}
                    title={poll.name}
                    description={describe(poll)}
                    timeRemaining={`Starts ${formatDate(poll.startDate)}`}
                  />
                ))
              ) : (
                <Text className="text-slateText text-sm">No upcoming polls.</Text>
              )}
            </View>
          </View>

          <View>
            <SectionHeader icon={CheckCircle2} title="Closed Polls" iconColor="#64748B" />
            <View className="gap-5">
              {closedPolls.length > 0 ? (
                closedPolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    id={poll.id}
                    status="closed"
                    icon={BarChart3}
                    voteType={poll.voteType}
                    title={poll.name}
                    description={describe(poll)}
                    timeRemaining={`Ended ${formatDate(poll.endDate)}`}
                  />
                ))
              ) : (
                <Text className="text-slateText text-sm">No closed polls yet.</Text>
              )}
            </View>
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}
