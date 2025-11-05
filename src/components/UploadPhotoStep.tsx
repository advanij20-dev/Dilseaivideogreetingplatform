import { Upload, Camera, Image, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState, useRef } from "react";

interface UploadPhotoStepProps {
  onPhotoUploaded: (file: File) => void;
}

export function UploadPhotoStep({ onPhotoUploaded }: UploadPhotoStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.type);
      onPhotoUploaded(file);
    }
  };

  const handleGalleryClick = () => {
    console.log("Gallery button clicked");
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    console.log("Camera button clicked");
    cameraInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <h1 className="bg-gradient-to-r from-[#FF6B35] via-[#6B46C1] to-[#FFD700] bg-clip-text text-transparent">
            Dilse.ai
          </h1>
          <Sparkles className="w-8 h-8 text-[#FFD700]" />
        </div>
        <p className="text-sm text-gray-500 italic mb-2">From the Heart</p>
        <p className="text-gray-600 max-w-md mx-auto">
          Transform your photo into a beautiful emotional greeting video in under 60 seconds
        </p>
      </div>

      {/* Step Indicator */}
      <div className="text-sm text-gray-500 mb-4">Step 1/4</div>

      {/* Upload Card */}
      <Card
        className={`w-full max-w-md border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-[#6B46C1] bg-purple-50 scale-[1.02]"
            : "border-gray-300 hover:border-[#FF6B35]"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-8 sm:p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#6B46C1] flex items-center justify-center shadow-lg">
            <Upload className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="mb-2">Choose Your Photo</h2>
          <p className="text-gray-500 mb-6">
            Drag and drop or click to browse
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload photo from gallery"
          />

          <Button
            onClick={handleGalleryClick}
            type="button"
            className="bg-gradient-to-r from-[#FF6B35] to-[#6B46C1] hover:from-[#ff5722] hover:to-[#5a3aa0] w-full h-14 rounded-full mb-3 shadow-lg transition-transform hover:scale-105"
          >
            <Image className="w-5 h-5 mr-2" />
            Choose from Gallery
          </Button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Take photo with camera"
          />

          <Button
            onClick={handleCameraClick}
            type="button"
            variant="outline"
            className="w-full h-14 rounded-full border-2 hover:bg-gray-50 transition-transform hover:scale-105"
          >
            <Camera className="w-5 h-5 mr-2" />
            Take Photo
          </Button>
        </div>
      </Card>

      {/* Pro Tips */}
      <Card className="w-full max-w-md mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="p-4">
          <p className="text-sm mb-2">💡 Pro Tips:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Clear face visibility</li>
            <li>• Good lighting</li>
            <li>• Smile! 😊</li>
          </ul>
        </div>
      </Card>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Supports JPG, PNG • Auto-crops to 9:16 for WhatsApp Status
      </p>
    </div>
  );
}
