import React, { useState } from "react";
import { Upload, Plus, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChatInterface } from "./ChatInterface";
import { TemplateSelector } from "./TemplateSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  const [activeTab, setActiveTab] = useState<"chat" | "templates">("chat");

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
    // Reset to allow new upload
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

  const canGenerate =
    uploadedImageUrl &&
    (userRequest.trim().length > 0 || selectedTemplate !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="bg-green-600 text-white text-center py-2 font-bold text-lg">
          ✨ NEW 2-STEP DESIGN ✨
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#6B46C1] to-[#FFD700] bg-clip-text text-transparent">
                Dilse.ai
              </h1>
              <Sparkles className="w-6 h-6 text-[#FFD700]" />
            </div>
            <p className="text-sm text-gray-500 italic">From the Heart</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Left Column - Upload (40%) */}
          <div className="lg:col-span-5">
            <Card className="p-6 h-full">
              <h2 className="text-xl font-semibold mb-4">
                Upload Photo or Video
              </h2>

              {!uploadedImageUrl ? (
                /* Upload Area */
                <div
                  className={`border-2 border-dashed rounded-lg transition-all duration-300 ${
                    isDragging
                      ? "border-purple-500 bg-purple-50 scale-[1.02]"
                      : "border-gray-300 hover:border-purple-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="p-8 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Plus className="w-16 h-16 text-white" />
                    </div>

                    <h3 className="text-lg font-medium mb-2">
                      Choose Your Photo or Video
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm">
                      Drag and drop or click to browse
                    </p>

                    <input
                      type="file"
                      id="media-upload"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <label htmlFor="media-upload">
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 w-full h-12 rounded-full shadow-lg transition-transform hover:scale-105"
                        asChild
                      >
                        <span>
                          <Upload className="w-5 h-5 mr-2" />
                          Browse Files
                        </span>
                      </Button>
                    </label>

                    <p className="text-xs text-gray-400 mt-4">
                      Supports JPG, PNG, MP4 • Optimized for WhatsApp Status
                    </p>
                  </div>
                </div>
              ) : (
                /* Preview Area */
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded preview"
                      className="w-full h-auto object-cover"
                    />
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Photo uploaded successfully!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Now choose how you want to create your video →
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Chat/Templates (60%) */}
          <div className="lg:col-span-7">
            <Card className="p-6 h-full">
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "chat" | "templates")
                }
                className="h-full flex flex-col"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="chat">AI Chat</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 mt-0">
                  <ChatInterface
                    onMessageSubmit={(message) => {
                      setUserRequest(message);
                      setSelectedTemplate(null); // Clear template if using chat
                    }}
                    userRequest={userRequest}
                  />
                </TabsContent>

                <TabsContent value="templates" className="flex-1 mt-0">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={(template) => {
                      setSelectedTemplate(template);
                      setUserRequest(""); // Clear chat request if using template
                    }}
                    recipientName={recipientName}
                    onRecipientNameChange={setRecipientName}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Generate Button - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-10">
          <div className="container mx-auto">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:scale-100"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {!uploadedImageUrl
                ? "Upload a Photo First"
                : !canGenerate
                ? "Describe What You Want or Choose a Template"
                : "Generate Video"}
            </Button>
            {canGenerate && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Your video will be ready in about 60 seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
