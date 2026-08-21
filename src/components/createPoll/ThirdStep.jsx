import { useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, Trash2, Plus, Rocket } from 'lucide-react-native';

export default function ThirdStep({ onBack, formData, setFormData, handleSubmit, isSubmitting = false }) {
  const [candidates, setCandidates] = useState(formData.candidates);

  const updateCandidate = (idx, value) => {
    const updated = [...candidates];
    updated[idx] = value;
    setCandidates(updated);
    setFormData('candidates', updated);
  };

  const addCandidate = () => {
    const updated = [...candidates, ''];
    setCandidates(updated);
    setFormData('candidates', updated);
  };

  const removeCandidate = (idx) => {
    const updated = candidates.filter((_, i) => i !== idx);
    setCandidates(updated);
    setFormData('candidates', updated);
  };

  const validate = () => {
    if (candidates.length < 2) return false;
    const maxRankings = formData.votingStrategy === 'Single Choice' ? 1 : Number(formData.maxRankings);
    if (candidates.length < maxRankings) return false;
    if (candidates.some((c) => c.trim() === '')) return false;
    return true;
  };

  return (
    <View className="flex-1">
      <View className="p-6 flex-1">
        <Text className="text-xl font-bold text-slate-900 mb-1">Poll Candidates</Text>
        <Text className="text-sm text-slate-500 mb-8">Add the candidates available for voting.</Text>

        <View className="gap-3">
          {candidates.map((cand, idx) => (
            <View key={idx} className="flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <TextInput
                value={cand}
                onChangeText={(text) => updateCandidate(idx, text)}
                placeholder="Candidate Name (e.g., Alice)"
                placeholderTextColor="#94a3b8"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"
              />
              <Pressable onPress={() => removeCandidate(idx)} className="p-2">
                <Trash2 size={18} color="#cbd5e1" />
              </Pressable>
            </View>
          ))}

          <Pressable onPress={addCandidate} className="flex-row items-center gap-2 mt-2">
            <View className="w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
              <Plus size={13} color="#fff" />
            </View>
            <Text className="text-blue-600 text-sm font-bold">Add Another Candidate</Text>
          </Pressable>
        </View>
      </View>

      <View className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex-row items-center justify-between">
        <Pressable onPress={onBack} className="flex-row items-center gap-2 bg-white border border-slate-200 active:bg-slate-50 px-6 py-2.5 rounded-lg">
          <ArrowLeft size={16} color="#334155" />
          <Text className="text-sm font-bold text-slate-700">Back</Text>
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          disabled={!validate() || isSubmitting}
          className={`flex-row items-center justify-center gap-2 px-6 py-2.5 rounded-lg ${
            !validate() || isSubmitting ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white text-sm font-bold">Deploying...</Text>
            </>
          ) : (
            <>
              <Text className="text-white text-sm font-bold">Deploy Poll</Text>
              <Rocket size={16} color="#fff" />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
