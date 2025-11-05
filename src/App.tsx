import { useState } from "react";
import { UploadPhotoStep } from "./components/UploadPhotoStep";
import { ChooseEmotionStep } from "./components/ChooseEmotionStep";
import { ChooseOccasionStep } from "./components/ChooseOccasionStep";
import { GenerateShareStep } from "./components/GenerateShareStep";
import type { EmotionType } from "./components/ChooseEmotionStep";
import type { OccasionType } from "./components/ChooseOccasionStep";
import { Toaster } from "./components/ui/sonner";

type Step = "upload" | "emotion" | "occasion" | "generate";

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | null>(null);
  const [recipientName, setRecipientName] = useState("");

  const handlePhotoUploaded = (file: File) => {
    setUploadedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    setCurrentStep("emotion");
  };

  const handleEmotionNext = () => {
    if (selectedEmotion) {
      setCurrentStep("occasion");
    }
  };

  const handleOccasionNext = () => {
    if (selectedOccasion) {
      setCurrentStep("generate");
    }
  };

  const handleCreateAnother = () => {
    // Reset all state
    setCurrentStep("upload");
    setUploadedFile(null);
    setUploadedImageUrl("");
    setSelectedEmotion(null);
    setSelectedOccasion(null);
    setRecipientName("");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {currentStep === "upload" && (
          <UploadPhotoStep onPhotoUploaded={handlePhotoUploaded} />
        )}

        {currentStep === "emotion" && uploadedImageUrl && (
          <ChooseEmotionStep
            selectedEmotion={selectedEmotion}
            onEmotionSelected={setSelectedEmotion}
            onNext={handleEmotionNext}
            onBack={() => setCurrentStep("upload")}
            uploadedImage={uploadedImageUrl}
          />
        )}

        {currentStep === "occasion" && (
          <ChooseOccasionStep
            selectedOccasion={selectedOccasion}
            onOccasionSelected={setSelectedOccasion}
            recipientName={recipientName}
            onRecipientNameChange={setRecipientName}
            onNext={handleOccasionNext}
            onBack={() => setCurrentStep("emotion")}
          />
        )}

        {currentStep === "generate" && uploadedImageUrl && selectedEmotion && selectedOccasion && (
          <GenerateShareStep
            uploadedImage={uploadedImageUrl}
            emotion={selectedEmotion}
            occasion={selectedOccasion}
            recipientName={recipientName}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </div>
      <Toaster position="top-center" richColors />
    </>
  );
}
