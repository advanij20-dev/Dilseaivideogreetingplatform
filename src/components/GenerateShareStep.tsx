import { useState, useEffect } from "react";
import { Download, Share2, RefreshCw, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { VideoGenerator } from "./VideoGenerator";
import { VideoPlayer } from "./VideoPlayer";
import type { EmotionType } from "./ChooseEmotionStep";
import type { OccasionType } from "./ChooseOccasionStep";
import { toast } from "sonner@2.0.3";

interface GenerateShareStepProps {
  uploadedImage: string;
  emotion: EmotionType;
  occasion: OccasionType;
  recipientName: string;
  onCreateAnother: () => void;
}

const progressMessages = [
  { text: "Adding magic to your photo…", min: 0, max: 30 },
  { text: "Weaving emotions into motion…", min: 30, max: 60 },
  { text: "Creating something beautiful…", min: 60, max: 90 },
  { text: "Almost ready to share love…", min: 90, max: 100 }
];

export function GenerateShareStep({
  uploadedImage,
  emotion,
  occasion,
  recipientName,
  onCreateAnother
}: GenerateShareStepProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(progressMessages[0].text);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    // Simulate video generation progress
    const duration = 35000; // 35 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + increment, 100);
        
        // Update message based on progress
        const message = progressMessages.find(
          (msg) => newProgress >= msg.min && newProgress < msg.max
        );
        if (message) {
          setCurrentMessage(message.text);
        }

        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleVideoComplete = (blob: Blob) => {
    setVideoBlob(blob);
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setIsComplete(true);
    setProgress(100);
    toast.success("Your video is ready! 🎉");
  };

  const handleWhatsAppShare = () => {
    if (videoBlob) {
      // Create a File from the Blob
      const file = new File([videoBlob], "dilse-greeting.webm", { type: "video/webm" });
      
      // Try to share using Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: "Dilse.ai Video Greeting",
          text: recipientName 
            ? `A special video greeting for ${recipientName}!` 
            : "A special video greeting!",
          files: [file]
        }).catch((error) => {
          console.log("Error sharing:", error);
          toast.error("Sharing failed. Try downloading instead!");
        });
      } else {
        // Fallback to WhatsApp Web
        const message = recipientName
          ? `Check out this special video greeting for ${recipientName}! Created with Dilse.ai`
          : "Check out this special video greeting! Created with Dilse.ai";
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
        toast.info("Download the video to share on WhatsApp");
      }
    }
  };

  const handleDownload = () => {
    if (videoBlob && videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `dilse-${occasion}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Video downloaded!");
    }
  };

  const handleSocialShare = (platform: string) => {
    const message = recipientName 
      ? `A special video greeting for ${recipientName}! Created with Dilse.ai` 
      : "A special video greeting! Created with Dilse.ai";
    
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case "instagram":
        toast.info("Download the video to share on Instagram!");
        handleDownload();
        return;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  if (!isComplete) {
    return (
      <>
        <VideoGenerator
          imageUrl={uploadedImage}
          emotion={emotion}
          occasion={occasion}
          recipientName={recipientName}
          onComplete={handleVideoComplete}
        />
        
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-4">Step 4/4</p>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#6B46C1] flex items-center justify-center animate-pulse shadow-xl">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {["🎨", "✨", "💝", "🎬"][Math.floor(progress / 25) % 4]}
                  </div>
                </div>
                <h2 className="mb-3">Creating Your Video</h2>
                <p className="text-gray-600 animate-pulse">{currentMessage}</p>
              </div>

              <div className="space-y-4">
                <Progress value={progress} className="h-3 bg-white/50" />
                <p className="text-center text-gray-700">
                  {Math.round(progress)}% complete
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  ⏱️ This usually takes 35-45 seconds
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Adding magic to your memories...
                </p>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#6B46C1] mb-4 animate-bounce">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="mb-2">Your Video is Ready!</h2>
          <p className="text-gray-600">
            Share the love with your special someone
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-sm">
            {videoUrl && <VideoPlayer videoUrl={videoUrl} autoPlay={true} emotion={emotion} />}
          </div>
        </div>

        {/* Video Details */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">12 seconds</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Format:</span>
              <span className="font-medium">9:16 (WhatsApp Status)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Emotion:</span>
              <span className="font-medium capitalize">{emotion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Occasion:</span>
              <span className="font-medium capitalize">{occasion}</span>
            </div>
            {recipientName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">For:</span>
                <span className="font-medium">{recipientName} 💝</span>
              </div>
            )}
          </div>
        </Card>

        {/* Primary Share Button */}
        <Button
          onClick={handleWhatsAppShare}
          className="w-full h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white shadow-lg mb-3 transition-transform hover:scale-105"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share on WhatsApp
        </Button>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full h-14 rounded-full border-2 mb-6 transition-transform hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Video
        </Button>

        {/* Other Share Options */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Share on other platforms</p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => handleSocialShare("facebook")}
              variant="outline"
              className="h-12 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-500"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
            </Button>
            <Button
              onClick={() => handleSocialShare("instagram")}
              variant="outline"
              className="h-12 rounded-xl border-2 hover:bg-pink-50 hover:border-pink-500"
            >
              <Instagram className="w-5 h-5 text-pink-600" />
            </Button>
            <Button
              onClick={() => handleSocialShare("twitter")}
              variant="outline"
              className="h-12 rounded-xl border-2 hover:bg-sky-50 hover:border-sky-500"
            >
              <Twitter className="w-5 h-5 text-sky-600" />
            </Button>
          </div>
        </div>

        {/* Create Another */}
        <Button
          onClick={onCreateAnother}
          variant="outline"
          className="w-full h-14 rounded-full border-2 transition-transform hover:scale-105"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Create Another Video
        </Button>

        {/* Success Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your video is ready to spread joy! 💝✨
          </p>
        </div>
      </div>
    </div>
  );
}
