import { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronRight,
  Droplets,
  Heart,
  Shield,
  Layers,
  GraduationCap,
  Leaf,
} from 'lucide-react-native';
import AppHeader from '../../../src/components/layout/AppHeader';
import AppFooter from '../../../src/components/layout/AppFooter';
import CandidateCard from '../../../src/components/pollDetails/CandidateCard';
import InfoBanner from '../../../src/components/pollDetails/InfoBanner';
import PollTitle from '../../../src/components/pollDetails/PollTitle';
import Popup from '../../../src/components/shared/Popup';
import { fetchPollDetails, fetchCandidates } from '../../../src/api/client';
import { getPollDetailsFromChain, checkHasUserVoted, checkIsAllowedVoter } from '../../../src/chain/readFromChain';
import { useAuth } from '../../../src/context/AuthContext';

const metaAssets = [
  { icon: Layers, color: '#818cf8', bg: 'bg-slate-900' },
  { icon: Leaf, color: '#34d399', bg: 'bg-slate-800' },
  { icon: Shield, color: '#9333ea', bg: 'bg-purple-50' },
  { icon: GraduationCap, color: '#f97316', bg: 'bg-orange-50' },
  { icon: Droplets, color: '#ffffff', bg: 'bg-cyan-600' },
  { icon: Heart, color: '#f43f5e', bg: 'bg-rose-50' },
];

export default function PollDetails() {
  const { id: pollId } = useLocalSearchParams();
  const router = useRouter();
  const { userRole, isConnected, userAddress } = useAuth();

  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);
  const [candidateNames, setCandidateNames] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAllowedVoter, setIsAllowedVoter] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pollRes, candRes] = await Promise.all([
          fetchPollDetails(pollId),
          fetchCandidates({ pollId }),
        ]);
        let mergedPoll = pollRes.poll;
        let names = (candRes.candidates || []).map((c) => c.name);

        // Polls created via the website are also deployed on-chain (chainPollId set) — the
        // contract is authoritative for their config, so mirror the web app's behavior here.
        if (mergedPoll?.chainPollId) {
          const chainDetails = await getPollDetailsFromChain(mergedPoll.chainPollId);
          if (chainDetails) {
            mergedPoll = {
              ...mergedPoll,
              voteType: chainDetails.voteType,
              maxChoices: chainDetails.maxChoices,
              candidateCount: chainDetails.candidateCount,
            };
            if (names.length === 0) names = chainDetails.candidateNames;
          }
          if (userAddress) {
            const [voted, allowed] = await Promise.all([
              checkHasUserVoted(mergedPoll.chainPollId, userAddress),
              checkIsAllowedVoter(mergedPoll.chainPollId, userAddress),
            ]);
            setHasVoted(voted);
            setIsAllowedVoter(allowed);
          }
        }

        setPoll(mergedPoll);
        setCandidateNames(names);
      } catch (err) {
        console.error('Failed to load poll:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pollId, userAddress]);

  const handleVote = async () => {
    if (!isConnected || userRole === 'Guest') {
      setPopupContent({ title: 'Login Required', message: 'Please log in to vote in this poll.' });
      setPopupOpen(true);
      return;
    }
    if (poll?.chainPollId && !isAllowedVoter) {
      setPopupContent({ title: 'Not Eligible', message: 'You are not an allowed voter for this poll.' });
      setPopupOpen(true);
      return;
    }
    if (hasVoted) {
      setPopupContent({ title: 'Already Voted', message: 'You have already cast your vote for this poll.' });
      setPopupOpen(true);
      return;
    }
    if (selected.length === 0) {
      setPopupContent({ title: 'Wait!', message: 'Please select at least 1 candidate to vote.' });
      setPopupOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      setHasVoted(true);
      setPopupContent({ title: 'Success', message: 'Your vote has been submitted successfully!' });
      setPopupOpen(true);
    } catch (err) {
      setPopupContent({ title: 'Transaction Failed', message: 'There was an error submitting your vote. Please try again.' });
      setPopupOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxChoices = poll?.maxChoices ?? candidateNames.length;
  const candidateCount = poll?.candidateCount ?? candidateNames.length;

  const toggleSelection = (id) => {
    if (!isConnected || userRole === 'Guest') return;
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else if (poll && selected.length < maxChoices) {
      setSelected([...selected, id]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <AppHeader />
        <View className="py-20 items-center">
          <ActivityIndicator color="#1D58E9" />
          <Text className="text-slate-500 font-medium mt-3">Loading poll details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!poll) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <AppHeader />
        <Text className="text-center py-20 font-medium text-red-500">Poll not found!</Text>
      </SafeAreaView>
    );
  }

  const generatedCandidates = candidateNames.map((name, index) => {
    const asset = metaAssets[index % metaAssets.length];
    return {
      id: index + 1,
      name,
      description: '',
      icon: asset.icon,
      iconColor: asset.color,
      iconBg: asset.bg,
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <AppHeader />
      <View className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="px-5 pt-8 pb-36" keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.push('/poll-list')} className="flex-row items-center gap-1.5 mb-5">
            <View className="w-3 h-3 bg-slate-400 rounded-sm" />
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Polls</Text>
            <ChevronRight size={12} color="#64748b" />
            <Text className="text-xs font-semibold text-slate-800 uppercase tracking-wider">{poll.name}</Text>
          </Pressable>

          <PollTitle
            title={poll.name}
            desc={`This poll allows a maximum of ${maxChoices} choices. Please rank your preferences by tapping the cards below.`}
          />

          {!isConnected && (
            <View className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <Text className="text-sm font-semibold text-amber-800">Login to vote in this poll.</Text>
            </View>
          )}

          {isConnected && poll.chainPollId && !isAllowedVoter && !hasVoted && (
            <View className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <Text className="text-sm font-semibold text-amber-800">You are not an allowed voter for this poll.</Text>
            </View>
          )}

          {hasVoted && (
            <View className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <Text className="text-sm font-semibold text-emerald-800">You have already voted in this poll.</Text>
            </View>
          )}

          <InfoBanner
            startDate={new Date(poll.startDate).toLocaleDateString()}
            endDate={new Date(poll.endDate).toLocaleDateString()}
            votingType={poll.voteType === 1 ? 'Majority Voting' : `Ranked Choice (Top ${maxChoices})`}
          />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold text-slate-900 tracking-tight">Candidates</Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs font-bold">{candidateCount} Options</Text>
            </View>
          </View>

          <View className="gap-4">
            {generatedCandidates.map((candidate) => {
              const isSelected = selected.includes(candidate.id);
              const rankIndex = selected.indexOf(candidate.id) + 1;
              return (
                <CandidateCard
                  key={candidate.id}
                  toggleSelection={toggleSelection}
                  candidate={candidate}
                  isSelected={isSelected}
                  rankIndex={rankIndex}
                />
              );
            })}
          </View>

          <AppFooter />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <View className="bg-slate-950/95 p-4 rounded-2xl flex-row items-center justify-between border border-white/10">
            <View className="flex-row gap-3">
              {Array.from({ length: maxChoices }).map((_, i) => (
                <View key={i} className="items-center gap-1 w-14">
                  <View
                    className={`w-9 h-9 rounded-full items-center justify-center ${
                      selected[i] ? 'bg-indigo-500' : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    <Text className={`text-sm font-bold ${selected[i] ? 'text-white' : 'text-slate-500'}`}>
                      {selected[i] || i + 1}
                    </Text>
                  </View>
                  <Text className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                    {['1st', '2nd', '3rd', '4th', '5th'][i] || `${i + 1}th`}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={handleVote}
              disabled={selected.length === 0 || isSubmitting || !isConnected || hasVoted || (poll.chainPollId && !isAllowedVoter)}
              className={`px-6 py-3.5 rounded-xl flex-row items-center gap-2 ${
                selected.length > 0 && !isSubmitting ? 'bg-white' : 'bg-slate-800'
              }`}
            >
              <Text className={`font-bold ${selected.length > 0 && !isSubmitting ? 'text-slate-900' : 'text-slate-500'}`}>
                {isSubmitting ? 'Voting...' : 'Submit Cast'}
              </Text>
              <ChevronRight size={16} color={selected.length > 0 && !isSubmitting ? '#0f172a' : '#64748b'} />
            </Pressable>
          </View>
        </View>
      </View>

      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        message={popupContent.message}
        isAlert
      />
    </SafeAreaView>
  );
}
