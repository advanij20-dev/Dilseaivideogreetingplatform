import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Music } from "lucide-react";
import { Button } from "./ui/button";
import { Howl } from 'howler';
import type { EmotionType } from "./ChooseEmotionStep";

interface VideoPlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
  emotion?: EmotionType;
}

// Background music for each emotion
const emotionMusicUrls: Record<EmotionType, string> = {
  heartfelt: 'https://assets.mixkit.co/active_storage/sfx/2490/2490-preview.mp3',
  funny: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  elegant: 'https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3',
  cinematic: 'https://assets.mixkit.co/active_storage/sfx/2494/2494-preview.mp3',
  traditional: 'https://assets.mixkit.co/active_storage/sfx/2489/2489-preview.mp3',
};

export function VideoPlayer({ videoUrl, autoPlay = true, emotion }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [progress, setProgress] = useState(0);

  // Initialize background music
  useEffect(() => {
    if (emotion && isMusicEnabled) {
      audioRef.current = new Howl({
        src: [emotionMusicUrls[emotion]],
        loop: true,
        volume: 0.3,
        autoplay: false,
      });

      // Play music if video autoplays
      if (autoPlay) {
        audioRef.current?.play();
      }
    }

    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current.unload();
      }
    };
  }, [emotion, isMusicEnabled]);

  // Sync music with video playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && isMusicEnabled && !isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMusicEnabled, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);

      // Also control background music
      if (audioRef.current) {
        if (!isMuted) {
          audioRef.current.pause();
        } else if (isPlaying && isMusicEnabled) {
          audioRef.current.play();
        }
      }
    }
  };

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
    if (audioRef.current) {
      if (isMusicEnabled) {
        audioRef.current.stop();
      } else if (isPlaying && !isMuted) {
        audioRef.current.play();
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="relative group aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Play/Pause Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/20 transition-colors"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transform transition-transform hover:scale-110">
            <Play className="w-10 h-10 text-purple-600 ml-1" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div
          className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-white hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          <div className="flex gap-2">
            {emotion && (
              <Button
                size="icon"
                variant="ghost"
                className={`h-10 w-10 text-white hover:bg-white/20 ${
                  isMusicEnabled ? 'bg-white/10' : ''
                }`}
                onClick={toggleMusic}
                title={isMusicEnabled ? 'Disable background music' : 'Enable background music'}
              >
                <Music className={`w-5 h-5 ${isMusicEnabled ? 'text-yellow-400' : ''}`} />
              </Button>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
