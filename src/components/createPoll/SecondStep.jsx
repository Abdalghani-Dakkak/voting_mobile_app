import { useState } from 'react';
import { View, Text, Pressable, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react-native';

function DateField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const openPicker = () => {
    setMode('date');
    setShow(true);
  };

  const handleChange = (event, selected) => {
    if (Platform.OS === 'android') setShow(false);
    if (!selected) return;
    if (Platform.OS === 'android' && mode === 'date') {
      const merged = new Date(value);
      merged.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      onChange(merged);
      setMode('time');
      setShow(true);
      return;
    }
    if (Platform.OS === 'android' && mode === 'time') {
      const merged = new Date(value);
      merged.setHours(selected.getHours(), selected.getMinutes());
      onChange(merged);
      return;
    }
    onChange(selected);
  };

  const formatted = value
    ? value.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' }) +
      ', ' +
      value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : 'Select date & time';

  return (
    <View className="flex-1">
      <Text className="text-sm font-bold text-slate-700 mb-2">{label}</Text>
      <Pressable onPress={openPicker} className="flex-row items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 shadow-sm bg-white">
        <Calendar size={16} color="#94a3b8" />
        <Text className="text-sm text-slate-800">{formatted}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={Platform.OS === 'android' ? mode : 'datetime'}
          is24Hour={false}
          onChange={handleChange}
          {...(Platform.OS === 'ios' ? { display: 'inline' } : {})}
        />
      )}
    </View>
  );
}

export default function SecondStep({ onNext, onBack, formData, setFormData }) {
  const isSingle = formData.votingStrategy === 'Single Choice';

  return (
    <View className="flex-1">
      <View className="p-6 flex-1">
        <Text className="text-xl font-bold text-slate-900 mb-1">Configuration</Text>
        <Text className="text-sm text-slate-500 mb-8">Set the rules and timeline.</Text>

        <View className="gap-6">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Voting Strategy</Text>
            <View className="flex-row gap-3">
              {['Ranked Choice', 'Single Choice'].map((strategy) => (
                <Pressable
                  key={strategy}
                  onPress={() => setFormData('votingStrategy', strategy)}
                  className={`flex-1 px-4 py-3 rounded-xl border items-center ${
                    formData.votingStrategy === strategy ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${formData.votingStrategy === strategy ? 'text-white' : 'text-slate-700'}`}>
                    {strategy}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Max Rankings Allowed</Text>
            <TextInput
              editable={!isSingle}
              keyboardType="number-pad"
              value={String(isSingle ? 1 : formData.maxRankings)}
              onChangeText={(text) => setFormData('maxRankings', text.replace(/[^0-9]/g, ''))}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm shadow-sm ${isSingle ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-800'}`}
            />
            <Text className="text-[11px] text-slate-500 mt-1.5 font-medium">Voters can rank up to this many options.</Text>
          </View>

          <View className="gap-4">
            <DateField label="Start Date & Time" value={formData.startDate} onChange={(d) => setFormData('startDate', d)} />
            <DateField label="End Date & Time" value={formData.endDate} onChange={(d) => setFormData('endDate', d)} />
          </View>
        </View>
      </View>

      <View className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex-row justify-between">
        <Pressable onPress={onBack} className="flex-row items-center gap-2 bg-white border border-slate-200 active:bg-slate-50 px-6 py-2.5 rounded-lg">
          <ArrowLeft size={16} color="#334155" />
          <Text className="text-sm font-bold text-slate-700">Back</Text>
        </Pressable>
        <Pressable
          onPress={onNext}
          disabled={!formData.startDate || !formData.endDate || (formData.votingStrategy === 'Ranked Choice' && !formData.maxRankings)}
          className={`flex-row items-center gap-2 px-6 py-2.5 rounded-lg ${
            !formData.startDate || !formData.endDate || (formData.votingStrategy === 'Ranked Choice' && !formData.maxRankings)
              ? 'bg-gray-400'
              : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          <Text className="text-white text-sm font-bold">Next</Text>
          <ArrowRight size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
