import { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import ScreenLayout from '../src/components/layout/ScreenLayout';
import FirstStep from '../src/components/createPoll/FirstStep';
import SecondStep from '../src/components/createPoll/SecondStep';
import ThirdStep from '../src/components/createPoll/ThirdStep';
import Popup from '../src/components/shared/Popup';
import LoadingOverlay from '../src/components/shared/LoadingOverlay';
import { createPoll, createCandidate } from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';

const steps = [
  { num: 1, label: 'Details' },
  { num: 2, label: 'Configuration' },
  { num: 3, label: 'Options' },
];

export default function CreatePoll() {
  const router = useRouter();
  const { isConnected, userRole, ready } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormDataState] = useState({
    title: '',
    VotersAddresses: [],
    votersFileName: '',
    votingStrategy: 'Ranked Choice',
    maxRankings: 3,
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000),
    candidates: [''],
  });

  useEffect(() => {
    if (!ready) return;
    if (!isConnected || userRole !== 'Organization') {
      setPopupContent({
        title: 'Organization Access Required',
        message: 'Only Organization accounts can create polls. Switch your demo role from Profile, then come back.',
      });
      setPopupOpen(true);
    }
  }, [ready]);

  const setFormData = (name, value) => setFormDataState((prev) => ({ ...prev, [name]: value }));

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const backendResponse = await createPoll({
        name: formData.title,
        description: '',
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        voteType: formData.votingStrategy === 'Single Choice' ? 0 : 1,
        maxChoices: formData.votingStrategy === 'Single Choice' ? 1 : Number(formData.maxRankings),
      });
      const backendId = backendResponse.pollId;

      for (const name of formData.candidates) {
        await createCandidate({ pollId: backendId, name });
      }

      setPopupContent({
        title: 'Success',
        message: `Poll created successfully! Backend ID: ${backendId}`,
      });
      setPopupOpen(true);
    } catch (error) {
      setPopupContent({
        title: 'Error',
        message: error.message || 'There was an error creating your poll. (This screen talks to your local backend — make sure it is reachable and you are authenticated as an Organization.)',
      });
      setPopupOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
    if (popupContent.title === 'Success') router.push('/poll-list');
  };

  return (
    <ScreenLayout contentClassName="px-4 pt-8 pb-6">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-black text-brand-navy tracking-tight">Create New Poll</Text>
      </View>

      <View className="flex-row items-center justify-center mb-8">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <View key={step.num} className="flex-row items-center">
              <View className="items-center w-16">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mb-1.5 ${
                    isCompleted || isCurrent ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  {isCompleted ? <Check size={16} color="#fff" /> : (
                    <Text className={`text-sm font-bold ${isCompleted || isCurrent ? 'text-white' : 'text-slate-500'}`}>{step.num}</Text>
                  )}
                </View>
                <Text className={`text-[11px] font-bold ${isCurrent || isCompleted ? 'text-blue-600' : 'text-slate-400'}`}>
                  {step.label}
                </Text>
              </View>
              {idx < steps.length - 1 && (
                <View className={`w-8 h-0.5 -mt-4 ${currentStep > idx + 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
              )}
            </View>
          );
        })}
      </View>

      <View className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ minHeight: 420 }}>
        {currentStep === 1 && <FirstStep formData={formData} setFormData={setFormData} onNext={handleNext} />}
        {currentStep === 2 && <SecondStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && (
          <ThirdStep
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </View>

      <Popup
        isOpen={popupOpen}
        onClose={closePopup}
        title={popupContent.title}
        message={popupContent.message}
        isAlert
      />
      <LoadingOverlay isOpen={isSubmitting} label="Deploying poll..." />
    </ScreenLayout>
  );
}
