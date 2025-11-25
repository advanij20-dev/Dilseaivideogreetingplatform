import { useState } from "react";
import { MainUploadScreen } from "./components/MainUploadScreen";
import { GenerateShareStep } from "./components/GenerateShareStep";
import { Toaster } from "./components/ui/sonner";

// Define types locally instead of importing from old components
type EmotionType = "heartfelt" | "funny" | "elegant" | "cinematic" | "traditional";
type OccasionType = "birthday" | "diwali" | "anniversary" | "wedding" | "newyear" | "justlove";
type Step = "main" | "generate";

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("main");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>("heartfelt");
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [userRequest, setUserRequest] = useState("");

  const handlePhotoUploaded = (file: File) => {
    setUploadedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
  };

  const handleGenerate = (data: {
    userRequest: string;
    selectedTemplate: OccasionType | null;
    recipientName: string;
  }) => {
    setUserRequest(data.userRequest);
    setSelectedOccasion(data.selectedTemplate);
    setRecipientName(data.recipientName);

    // Auto-determine emotion based on occasion
    if (data.selectedTemplate) {
      const emotionMap: Record<OccasionType, EmotionType> = {
        birthday: "funny",
        diwali: "traditional",
        anniversary: "heartfelt",
        wedding: "elegant",
        newyear: "cinematic",
        justlove: "heartfelt",
      };
      setSelectedEmotion(emotionMap[data.selectedTemplate] || "heartfelt");
    }

    setCurrentStep("generate");
  };

  const handleCreateAnother = () => {
    setCurrentStep("main");
    setUploadedFile(null);
    setUploadedImageUrl("");
    setSelectedEmotion("heartfelt");
    setSelectedOccasion(null);
    setRecipientName("");
    setUserRequest("");
  };

  return (
    <>
      {currentStep === "main" && (
        <MainUploadScreen
          uploadedImageUrl={uploadedImageUrl}
          onPhotoUploaded={handlePhotoUploaded}
          onGenerate={handleGenerate}
        />
      )}

      {currentStep === "generate" && uploadedImageUrl && selectedEmotion && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <GenerateShareStep
            uploadedImage={uploadedImageUrl}
            emotion={selectedEmotion}
            occasion={selectedOccasion || "justlove"}
            recipientName={recipientName}
            onCreateAnother={handleCreateAnother}
          />
        </div>
      )}

      <Toaster position="top-center" richColors />
    </>
  );
}
