import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ArrowRight, FileText } from 'lucide-react-native';

export default function FirstStep({ onNext, formData, setFormData }) {
  const pickCsv = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/comma-separated-values', copyToCacheDirectory: true });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset.name.endsWith('.csv') && asset.mimeType !== 'text/csv') {
      Alert.alert('Invalid file', 'Please select a valid CSV file.');
      return;
    }
    try {
      const content = await FileSystem.readAsStringAsync(asset.uri);
      const parsed = content
        .split(/[\r\n]+/)
        .flatMap((line) => line.split(','))
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      setFormData('VotersAddresses', parsed);
      setFormData('votersFileName', asset.name);
    } catch (err) {
      Alert.alert('Error', 'Could not read the selected file.');
    }
  };

  return (
    <View className="flex-1">
      <View className="p-6 flex-1">
        <Text className="text-xl font-bold text-slate-900 mb-1">General Information</Text>
        <Text className="text-sm text-slate-500 mb-8">Define the core details of your poll.</Text>

        <View className="gap-6">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Poll title</Text>
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData('title', text)}
              placeholder="e.g. Q4 Team Building Event Location"
              placeholderTextColor="#94a3b8"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm shadow-sm"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">
              Voters Addresses <Text className="text-slate-400 font-normal">(Upload CSV)</Text>
            </Text>
            <Pressable
              onPress={pickCsv}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 flex-row items-center gap-2 shadow-sm bg-white"
            >
              <FileText size={16} color="#2563eb" />
              <Text className="text-sm text-blue-700 font-semibold">
                {formData.votersFileName || 'Choose CSV file'}
              </Text>
            </Pressable>
            {formData.VotersAddresses?.length > 0 && (
              <Text className="text-right text-[11px] font-medium text-slate-500 mt-1">
                {formData.VotersAddresses.length} addresses loaded
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="px-6 py-4 border-t border-slate-100 bg-slate-50 items-end">
        <Pressable
          onPress={onNext}
          disabled={!formData.title}
          className={`flex-row items-center gap-2 px-6 py-2.5 rounded-lg ${
            !formData.title ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          <Text className="text-white text-sm font-bold">Next</Text>
          <ArrowRight size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
