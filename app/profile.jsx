import { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Wallet,
  Mail,
  Copy,
  CheckCircle2,
  Camera,
  User,
  Save,
  LogOut,
} from 'lucide-react-native';
import ScreenLayout from '../src/components/layout/ScreenLayout';
import ProfileHeader from '../src/components/profile/ProfileHeader';
import { useAuth } from '../src/context/AuthContext';
import { updateSelf } from '../src/api/client';

export default function Profile() {
  const router = useRouter();
  const { userAddress, userEmail, userFullName, userRole, isConnected, ready, disconnect } = useAuth();

  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (ready && !isConnected) router.replace('/signup');
  }, [ready, isConnected]);

  useEffect(() => {
    if (userFullName) setUsername(userFullName);
  }, [userFullName]);

  const handleCopy = async () => {
    if (!userAddress) return;
    await Clipboard.setStringAsync(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handleLogout = async () => {
    await disconnect();
    router.replace('/signup');
  };

  const handleSave = async () => {
    if (!username.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateSelf({ fullName: username.trim() });
      setMessage('Profile saved successfully!');
    } catch (err) {
      setMessage(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const formatAddress = (addr) => (addr ? `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}` : 'Not connected');

  return (
    <ScreenLayout contentClassName="px-5 pt-8 pb-6">
      <ProfileHeader />

      <View className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <Text className="text-xl font-bold text-brand-navy mb-6">Profile Settings</Text>

        {userRole && (
          <View className="mb-6 flex-row items-center gap-3">
            <Text className="text-sm font-semibold text-slate-500">Role:</Text>
            <View className="px-3 py-1 rounded-full bg-blue-50">
              <Text className="text-xs font-bold text-blue-600 uppercase">{userRole}</Text>
            </View>
          </View>
        )}

        <View className="items-center gap-3 mb-6">
          <Pressable onPress={handlePickImage} className="relative">
            <View className="w-24 h-24 rounded-full bg-[#F1F5F9] border-4 border-white shadow-sm items-center justify-center overflow-hidden">
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-full h-full" />
              ) : (
                <Camera size={32} color="#94A3B8" />
              )}
            </View>
          </Pressable>
          <Pressable onPress={handlePickImage} className="px-4 py-2 border border-slate-200 rounded-lg active:bg-slate-50">
            <Text className="text-sm font-semibold text-slate-700">Choose Image</Text>
          </Pressable>
          <Text className="text-xs text-slate-400">Recommended size: 256x256px.</Text>
        </View>

        <View className="border-t border-slate-100 mb-6" />

        <View className="gap-5 mb-6">
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <User size={14} color="#334155" />
              <Text className="text-sm font-semibold text-slate-700">Username</Text>
            </View>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your new username"
              placeholderTextColor="#94a3b8"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 shadow-sm"
            />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Mail size={14} color="#334155" />
              <Text className="text-sm font-semibold text-slate-700">Email Address</Text>
            </View>
            <View className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
              <Text className="text-sm text-slate-500">{userEmail || '—'}</Text>
            </View>
            <Text className="text-xs text-slate-400">Email is linked to your connected wallet account.</Text>
          </View>
        </View>

        <View className="gap-2 mb-6">
          <Text className="text-sm font-semibold text-slate-700">Wallet Address</Text>
          <View className="w-full bg-bg-panel border border-[#F1F5F9] rounded-xl p-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <Wallet size={18} color="#94A3B8" />
              <Text className="text-[13px] font-mono text-[#475569]" numberOfLines={1}>
                {formatAddress(userAddress)}
              </Text>
            </View>
            <Pressable onPress={handleCopy} className="p-1.5 rounded-md active:bg-[#E2E8F0]">
              {copied ? <CheckCircle2 size={18} color="#10B981" /> : <Copy size={18} color="#64748B" />}
            </Pressable>
          </View>
        </View>

        {message && (
          <View className="px-4 py-3 rounded-xl mb-6 bg-green-50 border border-green-200">
            <Text className="text-sm font-semibold text-green-700">{message}</Text>
          </View>
        )}

        <View className="gap-3">
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="flex-row items-center justify-center gap-2 bg-brand-blue active:bg-blue-700 px-6 py-3.5 rounded-xl shadow-sm"
          >
            <Save size={18} color="#fff" />
            <Text className="text-white font-bold">{saving ? 'Saving...' : 'Save Changes'}</Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 bg-rose-50 active:bg-rose-100 px-6 py-3.5 rounded-xl"
          >
            <LogOut size={18} color="#e11d48" />
            <Text className="text-rose-600 font-semibold">Log Out</Text>
          </Pressable>
        </View>
      </View>
    </ScreenLayout>
  );
}
