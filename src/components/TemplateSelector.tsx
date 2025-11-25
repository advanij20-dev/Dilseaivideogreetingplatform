import React from "react";
import {
  Cake,
  Heart,
  Sparkles,
  PartyPopper,
  Flame,
  Users,
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
  emoji: string;
  color: string;
  bgGradient: string;
  hoverBg: string;
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
    icon: <Cake className="w-6 h-6" />,
    emoji: "🎂",
    color: "text-pink-600",
    bgGradient: "from-pink-100 to-purple-100",
    hoverBg: "hover:from-pink-200 hover:to-purple-200",
  },
  {
    id: "diwali",
    label: "Diwali",
    icon: <Flame className="w-6 h-6" />,
    emoji: "🪔",
    color: "text-orange-600",
    bgGradient: "from-orange-100 to-yellow-100",
    hoverBg: "hover:from-orange-200 hover:to-yellow-200",
  },
  {
    id: "wedding",
    label: "Wedding",
    icon: <Users className="w-6 h-6" />,
    emoji: "💒",
    color: "text-red-600",
    bgGradient: "from-red-100 to-pink-100",
    hoverBg: "hover:from-red-200 hover:to-pink-200",
  },
  {
    id: "anniversary",
    label: "Anniversary",
    icon: <Heart className="w-6 h-6" />,
    emoji: "💕",
    color: "text-rose-600",
    bgGradient: "from-rose-100 to-pink-100",
    hoverBg: "hover:from-rose-200 hover:to-pink-200",
  },
  {
    id: "newyear",
    label: "New Year",
    icon: <PartyPopper className="w-6 h-6" />,
    emoji: "🎉",
    color: "text-blue-600",
    bgGradient: "from-blue-100 to-purple-100",
    hoverBg: "hover:from-blue-200 hover:to-purple-200",
  },
  {
    id: "justlove",
    label: "Just Love",
    icon: <Sparkles className="w-6 h-6" />,
    emoji: "❤️",
    color: "text-purple-600",
    bgGradient: "from-purple-100 to-pink-100",
    hoverBg: "hover:from-purple-200 hover:to-pink-200",
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  recipientName,
  onRecipientNameChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? `border-${template.color.replace('text-', '')} shadow-lg scale-105 bg-gradient-to-br ${template.bgGradient}`
                  : `border-gray-200 bg-white ${template.hoverBg} hover:shadow-md hover:scale-102`
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Large Emoji */}
                <div className="text-3xl">{template.emoji}</div>

                {/* Label and Icon */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={template.color}>{template.icon}</div>
                    <span
                      className={`font-semibold text-sm ${
                        isSelected ? template.color : "text-gray-700"
                      }`}
                    >
                      {template.label}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recipient Name Input */}
      {selectedTemplate && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label htmlFor="recipient-name" className="text-sm font-semibold mb-2 block">
            Recipient's Name (Optional)
          </Label>
          <Input
            id="recipient-name"
            value={recipientName}
            onChange={(e) => onRecipientNameChange(e.target.value)}
            placeholder="e.g., Priya, Mom, Best Friend"
            className="border-2 focus:border-purple-400 h-11"
          />
          <p className="text-xs text-gray-500 mt-2">
            ✨ Add a personal touch by including their name in the video
          </p>
        </div>
      )}
    </div>
  );
};
