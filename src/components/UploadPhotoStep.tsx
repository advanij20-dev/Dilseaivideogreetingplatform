import { Upload, Camera, Image, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { processUploadedImage, loadImage } from "../utils/imageProcessing";
import { hasValidFace, loadFaceDetectionModels } from "../utils/faceDetection";

interface UploadPhotoStepProps {
  onPhotoUploaded: (file: File) => void;
}

export function UploadPhotoStep({ onPhotoUploaded }: UploadPhotoStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setFaceDetected(null);
    setValidationWarnings([]);

    try {
      // Load face detection models in background
      loadFaceDetectionModels().catch(err => {
        console.warn("Face detection models failed to load:", err);
      });

      // Process and validate image
      const { processedImage, validation } = await processUploadedImage(file);

      // Show warnings if any
      if (validation.warnings.length > 0) {
        setValidationWarnings(validation.warnings);
        validation.warnings.forEach(warning => {
          toast.warning(warning);
        });
      }

      // Set preview
      setPreviewUrl(processedImage.url);

      // Detect face
      try {
        const img = await loadImage(processedImage.file);
        const faceResult = await hasValidFace(img);
        setFaceDetected(faceResult.isValid);

        if (!faceResult.isValid) {
          toast.warning("No face detected. The video will still be created, but it works best with clear faces!");
        } else if (faceResult.faceCount > 1) {
          toast.info(`${faceResult.faceCount} faces detected! We'll focus on the primary face.`);
        } else {
          toast.success("Perfect! Face detected clearly. ✨");
        }
      } catch (error) {
        console.warn("Face detection failed:", error);
        // Continue anyway - face detection is optional
        setFaceDetected(null);
      }

      // Use processed image
      onPhotoUploaded(processedImage.file);
      toast.success("Photo processed and ready!");

    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process image");
    } finally {
      setIsProcessing(false);
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
            : previewUrl
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-[#FF6B35]"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-8 sm:p-12 text-center">
          {!previewUrl ? (
            <>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#6B46C1] flex items-center justify-center shadow-lg">
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-white" />
                )}
              </div>

              <h2 className="mb-2">Choose Your Photo</h2>
              <p className="text-gray-500 mb-6">
                {isProcessing ? "Processing your photo..." : "Drag and drop or click to browse"}
              </p>

              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />

              <label htmlFor="photo-upload">
                <Button
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-[#FF6B35] to-[#6B46C1] hover:from-[#ff5722] hover:to-[#5a3aa0] w-full h-14 rounded-full mb-3 shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5 mr-2" />
                      Choose from Gallery
                    </>
                  )}
                </Button>
              </label>

              <label htmlFor="camera-upload">
                <input
                  type="file"
                  id="camera-upload"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Button
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full h-14 rounded-full border-2 hover:bg-gray-50 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
              </label>
            </>
          ) : (
            <>
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                {faceDetected === true && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Face detected</span>
                  </div>
                )}
                {faceDetected === false && (
                  <div className="flex items-center gap-2 text-yellow-600 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    <span>No face detected</span>
                  </div>
                )}
              </div>

              {validationWarnings.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    {validationWarnings[0]}
                  </p>
                </div>
              )}

              <Button
                onClick={() => {
                  setPreviewUrl("");
                  setFaceDetected(null);
                  setValidationWarnings([]);
                }}
                variant="outline"
                className="w-full h-12 rounded-full border-2"
              >
                Choose Different Photo
              </Button>
            </>
          )}
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
