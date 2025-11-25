import React, { useState } from "react";
import { Upload, Plus, X, Sparkles, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { TemplateSelector } from "./TemplateSelector";

type OccasionType =
  | "birthday"
  | "diwali"
  | "anniversary"
  | "wedding"
  | "newyear"
  | "justlove";

interface MainUploadScreenProps {
  uploadedImageUrl: string | null;
  onPhotoUploaded: (file: File) => void;
  onGenerate: (data: {
    userRequest: string;
    selectedTemplate: OccasionType | null;
    recipientName: string;
  }) => void;
}

export const MainUploadScreen: React.FC<MainUploadScreenProps> = ({
  uploadedImageUrl,
  onPhotoUploaded,
  onGenerate,
}) => {
  console.log("🎉 NEW 2-STEP DESIGN IS LOADING! 🎉");

  const [isDragging, setIsDragging] = useState(false);
  const [userRequest, setUserRequest] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<OccasionType | null>(null);
  const [recipientName, setRecipientName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUploaded(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      onPhotoUploaded(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    // This would need to call a parent handler to clear the image
    // For now, just clear local state
    setUserRequest("");
    setSelectedTemplate(null);
    setRecipientName("");
  };

  const handleGenerate = () => {
    onGenerate({
      userRequest,
      selectedTemplate,
      recipientName,
    });
  };

  const handleTemplateSelect = (template: OccasionType) => {
    setSelectedTemplate(template);
    setUserRequest(""); // Clear text input when template is selected
  };

  const canGenerate =
    uploadedImageUrl &&
    (userRequest.trim().length > 0 || selectedTemplate !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#6B46C1] to-[#FFD700] bg-clip-text text-transparent">
                Dilse.ai
              </h1>
              <Sparkles className="w-7 h-7 text-[#FFD700]" />
            </div>
            <p className="text-sm text-gray-500 italic">From the Heart ❤️</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Create Your Perfect Video Greeting
            </h2>
            <p className="text-lg text-gray-600">
              Upload a photo and describe what you want – AI will create a beautiful video in seconds
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Upload */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Upload Your Photo or Video
              </h3>

              {!uploadedImageUrl ? (
                /* Upload Area - Large and Prominent */
                <div
                  className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                    isDragging
                      ? "border-purple-500 bg-purple-100 scale-105 shadow-2xl"
                      : "border-gray-300 hover:border-purple-400 hover:shadow-xl"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  style={{ minHeight: "400px" }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    {/* Large Plus Icon with Gradient */}
                    <div className="w-40 h-40 mb-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#6B46C1] flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110">
                      <Plus className="w-24 h-24 text-white" strokeWidth={3} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Drop your photo here
                    </h3>
                    <p className="text-gray-600 mb-6 text-center max-w-sm">
                      or click to browse your files
                    </p>

                    <input
                      type="file"
                      id="media-upload"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <label htmlFor="media-upload" className="w-full max-w-xs">
                      <Button
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#FF6B35] to-[#6B46C1] hover:from-[#ff5722] hover:to-[#5a3aa0] shadow-lg transition-all duration-300 hover:scale-105"
                        asChild
                      >
                        <span>
                          <Upload className="w-6 h-6 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>

                    <p className="text-xs text-gray-400 mt-6">
                      Supports JPG, PNG, MP4 • Optimized for 9:16 format
                    </p>
                  </div>
                </div>
              ) : (
                /* Preview Area - Show uploaded image */
                <Card className="overflow-hidden shadow-xl">
                  <div className="relative">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded preview"
                      className="w-full h-auto object-cover rounded-t-lg"
                      style={{ maxHeight: "500px" }}
                    />
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-white"
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
                      <div>
                        <p className="text-lg font-bold text-green-700">
                          Photo uploaded successfully!
                        </p>
                        <p className="text-sm text-green-600">
                          Now describe your video or choose a template →
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Describe / Templates */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Step 2: Describe Your Video
              </h3>

              {/* AI Text Input */}
              <Card className="p-6 shadow-lg border-2 border-purple-200">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Describe what you want (use AI)
                  </label>
                  <div className="relative">
                    <Textarea
                      value={userRequest}
                      onChange={(e) => {
                        setUserRequest(e.target.value);
                        if (e.target.value.trim()) {
                          setSelectedTemplate(null); // Clear template if typing
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && canGenerate) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                      placeholder="E.g., 'Create a happy birthday video for my mom with hearts and balloons' or 'Make a Diwali greeting with traditional diyas and sparkles'"
                      className="min-h-32 text-base pr-14 resize-none border-2 focus:border-purple-400"
                      disabled={selectedTemplate !== null}
                    />
                    {userRequest.trim() && (
                      <Button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        size="icon"
                        className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                  {selectedTemplate && (
                    <p className="text-sm text-amber-600 mt-2 font-medium">
                      Template selected. Clear template to use text description.
                    </p>
                  )}
                </div>
              </Card>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-gray-600 font-semibold text-lg">
                    OR
                  </span>
                </div>
              </div>

              {/* Template Selector */}
              <Card className="p-6 shadow-lg border-2 border-orange-200">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Choose a quick template
                </label>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  recipientName={recipientName}
                  onRecipientNameChange={setRecipientName}
                />
              </Card>
            </div>
          </div>

          {/* Generate Button - Large and Prominent at Bottom */}
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full h-20 text-2xl font-bold rounded-2xl shadow-2xl transition-all duration-300 ${
                canGenerate
                  ? "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 hover:scale-105 hover:shadow-3xl"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {!uploadedImageUrl ? (
                <>
                  <Upload className="w-8 h-8 mr-3" />
                  Upload a Photo First
                </>
              ) : !canGenerate ? (
                <>
                  <Sparkles className="w-8 h-8 mr-3" />
                  Describe Your Video or Choose Template
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 mr-3" />
                  Generate My Video ✨
                </>
              )}
            </Button>
            {canGenerate && (
              <p className="text-center text-sm text-gray-600 mt-4">
                🎬 Your personalized video will be ready in about 60 seconds!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
