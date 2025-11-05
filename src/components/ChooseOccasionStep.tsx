import { Cake, Sparkles, Heart, Users, Calendar, MessageCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type OccasionType = "birthday" | "diwali" | "anniversary" | "wedding" | "newyear" | "justlove";

interface OccasionOption {
  id: OccasionType;
  name: string;
  caption: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface ChooseOccasionStepProps {
  selectedOccasion: OccasionType | null;
  onOccasionSelected: (occasion: OccasionType) => void;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const occasions: OccasionOption[] = [
  {
    id: "birthday",
    name: "Birthday",
    caption: "Wishing you joy, laughter, and endless blessings",
    icon: <Cake className="w-7 h-7" />,
    color: "text-[#E91E63]",
    bgColor: "bg-[#FCE4EC]"
  },
  {
    id: "diwali",
    name: "Diwali",
    caption: "May the festival of lights illuminate your path",
    icon: <Sparkles className="w-7 h-7" />,
    color: "text-[#FF9800]",
    bgColor: "bg-[#FFF3E0]"
  },
  {
    id: "anniversary",
    name: "Anniversary",
    caption: "Celebrating your beautiful journey together",
    icon: <Heart className="w-7 h-7" />,
    color: "text-[#E91E63]",
    bgColor: "bg-[#FCE4EC]"
  },
  {
    id: "wedding",
    name: "Wedding",
    caption: "Two hearts, one beautiful beginning",
    icon: <Users className="w-7 h-7" />,
    color: "text-[#9C27B0]",
    bgColor: "bg-[#F3E5F5]"
  },
  {
    id: "newyear",
    name: "New Year",
    caption: "New dreams, new hopes, new beginnings",
    icon: <Calendar className="w-7 h-7" />,
    color: "text-[#6B46C1]",
    bgColor: "bg-[#F3E5F5]"
  },
  {
    id: "justlove",
    name: "Just Love",
    caption: "Thinking of you with warmth and affection",
    icon: <MessageCircle className="w-7 h-7" />,
    color: "text-[#FF6B35]",
    bgColor: "bg-[#FBE9E7]"
  }
];

export function ChooseOccasionStep({
  selectedOccasion,
  onOccasionSelected,
  recipientName,
  onRecipientNameChange,
  onNext,
  onBack
}: ChooseOccasionStepProps) {
  const selectedOccasionData = occasions.find(o => o.id === selectedOccasion);

  return (
    <div className="min-h-screen px-4 py-6 pb-28">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">Step 3/4</p>
          <h2 className="mb-2">What's it for?</h2>
          <p className="text-gray-600">
            Choose the special occasion
          </p>
        </div>

        {/* Occasion Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {occasions.map((occasion) => (
            <Card
              key={occasion.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedOccasion === occasion.id
                  ? "ring-3 ring-[#6B46C1] scale-[1.05] shadow-xl"
                  : "hover:scale-[1.02] hover:shadow-md"
              }`}
              onClick={() => onOccasionSelected(occasion.id)}
            >
              <div className="p-5 text-center">
                <div className={`w-16 h-16 ${occasion.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 ${occasion.color} shadow-md`}>
                  {occasion.icon}
                </div>
                <h3 className="text-sm">{occasion.name}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Caption Preview */}
        {selectedOccasionData && (
          <Card className="p-5 mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
            <Label className="text-sm text-gray-600 mb-2 block">Video Caption</Label>
            <p className="text-gray-800 italic text-center">
              "{selectedOccasionData.caption}"
            </p>
          </Card>
        )}

        {/* Recipient Name */}
        <div className="mb-6">
          <Label htmlFor="recipient-name" className="mb-3 block text-center">
            Recipient's Name (Optional)
          </Label>
          <Input
            id="recipient-name"
            type="text"
            placeholder="e.g., Priya, Mom, Rahul"
            value={recipientName}
            onChange={(e) => onRecipientNameChange(e.target.value)}
            className="text-center h-12 rounded-xl border-2"
          />
          <p className="text-xs text-gray-400 text-center mt-2">
            Add a personal touch to your video greeting
          </p>
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
            disabled={!selectedOccasion}
            className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#6B46C1] hover:from-[#ff5722] hover:to-[#5a3aa0] disabled:opacity-50 shadow-lg"
          >
            Generate Video →
          </Button>
        </div>
      </div>
    </div>
  );
}
