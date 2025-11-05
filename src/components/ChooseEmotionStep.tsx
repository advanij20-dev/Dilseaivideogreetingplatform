import { Heart, Smile, Sparkles, Film, Lamp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export type EmotionType = "heartfelt" | "funny" | "elegant" | "cinematic" | "traditional";

interface EmotionOption {
  id: EmotionType;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
  audio: string;
  motion: string;
}

interface ChooseEmotionStepProps {
  selectedEmotion: EmotionType | null;
  onEmotionSelected: (emotion: EmotionType) => void;
  onNext: () => void;
  onBack: () => void;
  uploadedImage: string;
}

const emotions: EmotionOption[] = [
  {
    id: "heartfelt",
    name: "Heartfelt",
    description: "Warm & emotional",
    icon: <Heart className="w-8 h-8" />,
    gradient: "from-[#E91E63] via-[#FCE4EC] to-[#C2185B]",
    textColor: "text-[#E91E63]",
    audio: "Gentle instrumental, Indian classical",
    motion: "Slow zoom, floating hearts"
  },
  {
    id: "funny",
    name: "Funny",
    description: "Playful & joyful",
    icon: <Smile className="w-8 h-8" />,
    gradient: "from-[#FF9800] via-[#FFF3E0] to-[#F57C00]",
    textColor: "text-[#FF9800]",
    audio: "Upbeat Bollywood-style music",
    motion: "Quick cuts, bouncing animations"
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated & refined",
    icon: <Sparkles className="w-8 h-8" />,
    gradient: "from-[#9C27B0] via-[#F3E5F5] to-[#7B1FA2]",
    textColor: "text-[#9C27B0]",
    audio: "Classical fusion, sitar and piano",
    motion: "Smooth pans, subtle particle effects"
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Dramatic & epic",
    icon: <Film className="w-8 h-8" />,
    gradient: "from-[#212121] via-[#FAFAFA] to-[#FFD700]",
    textColor: "text-[#212121]",
    audio: "Orchestral swells, epic soundscape",
    motion: "Dynamic camera movements, lens flares"
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Cultural & festive",
    icon: <Lamp className="w-8 h-8" />,
    gradient: "from-[#FF5722] via-[#FBE9E7] to-[#D84315]",
    textColor: "text-[#FF5722]",
    audio: "Folk instruments, devotional undertones",
    motion: "Diya animations, rangoli patterns"
  }
];

export function ChooseEmotionStep({
  selectedEmotion,
  onEmotionSelected,
  onNext,
  onBack,
  uploadedImage
}: ChooseEmotionStepProps) {
  return (
    <div className="min-h-screen px-4 py-6 pb-28">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">Step 2/4</p>
          <h2 className="mb-2">Pick the Mood</h2>
          <p className="text-gray-600">
            Select the feeling you want to convey
          </p>
        </div>

        {/* Preview Image */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-[#6B46C1]">
            <img
              src={uploadedImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Emotion Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {emotions.map((emotion) => (
            <Card
              key={emotion.id}
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedEmotion === emotion.id
                  ? "ring-3 ring-[#6B46C1] scale-[1.02] shadow-xl"
                  : "hover:scale-[1.01] hover:shadow-lg"
              }`}
              onClick={() => onEmotionSelected(emotion.id)}
            >
              <div className="flex items-center p-4">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${emotion.gradient} flex items-center justify-center text-white mr-4 flex-shrink-0 shadow-lg`}
                >
                  {emotion.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={emotion.textColor}>{emotion.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{emotion.description}</p>
                  <p className="text-xs text-gray-400 truncate">{emotion.audio}</p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ml-2 transition-all ${
                    selectedEmotion === emotion.id
                      ? "border-[#6B46C1] bg-[#6B46C1] scale-110"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedEmotion === emotion.id && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex-1 h-14 rounded-full border-2 hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedEmotion}
            className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#6B46C1] hover:from-[#ff5722] hover:to-[#5a3aa0] disabled:opacity-50 shadow-lg"
          >
            Next: Choose Occasion
          </Button>
        </div>
      </div>
    </div>
  );
}
