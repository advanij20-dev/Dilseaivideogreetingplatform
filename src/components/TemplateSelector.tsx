import React from "react";
import {
  Cake,
  Heart,
  Sparkles,
  PartyPopper,
  CalendarDays,
  MessageCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type OccasionType =
  | "birthday"
  | "diwali"
  | "anniversary"
  | "wedding"
  | "newyear"
  | "justlove";

interface TemplateOption {
  id: OccasionType;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

interface TemplateSelectorProps {
  selectedTemplate: OccasionType | null;
  onTemplateSelect: (template: OccasionType) => void;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
}

const templates: TemplateOption[] = [
  {
    id: "birthday",
    label: "Birthday",
    icon: <Cake className="w-8 h-8" />,
    color: "text-pink-500",
    bgGradient: "from-pink-500/10 to-purple-500/10",
  },
  {
    id: "diwali",
    label: "Diwali",
    icon: <Sparkles className="w-8 h-8" />,
    color: "text-orange-500",
    bgGradient: "from-orange-500/10 to-yellow-500/10",
  },
  {
    id: "wedding",
    label: "Wedding",
    icon: <Heart className="w-8 h-8" />,
    color: "text-red-500",
    bgGradient: "from-red-500/10 to-pink-500/10",
  },
  {
    id: "anniversary",
    label: "Anniversary",
    icon: <Heart className="w-8 h-8" />,
    color: "text-purple-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    id: "newyear",
    label: "New Year",
    icon: <PartyPopper className="w-8 h-8" />,
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-purple-500/10",
  },
  {
    id: "justlove",
    label: "Just Love",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "text-gray-500",
    bgGradient: "from-gray-500/10 to-gray-400/10",
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  recipientName,
  onRecipientNameChange,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl mb-2">Choose a Template</h3>
        <p className="text-sm text-gray-500">
          Select the occasion for your video greeting
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <Card
              key={template.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? "border-2 border-purple-500 shadow-lg bg-gradient-to-br " +
                    template.bgGradient
                  : "border border-gray-200 hover:border-purple-300 hover:shadow-md"
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div
                  className={`${template.color} ${
                    isSelected ? "scale-110" : ""
                  } transition-transform duration-300`}
                >
                  {template.icon}
                </div>
                <p
                  className={`font-medium ${
                    isSelected ? "text-purple-700" : "text-gray-700"
                  }`}
                >
                  {template.label}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recipient Name Input */}
      <div className="mt-auto">
        <Label htmlFor="recipient-name" className="text-sm font-medium mb-2">
          Recipient's Name (Optional)
        </Label>
        <Input
          id="recipient-name"
          value={recipientName}
          onChange={(e) => onRecipientNameChange(e.target.value)}
          placeholder="e.g., Priya, Mom, Best Friend"
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-2">
          Personalize your video with their name
        </p>
      </div>
    </div>
  );
};
