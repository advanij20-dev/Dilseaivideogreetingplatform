import { useEffect, useRef } from "react";
import type { EmotionType } from "./ChooseEmotionStep";
import type { OccasionType } from "./ChooseOccasionStep";

interface VideoGeneratorProps {
  imageUrl: string;
  emotion: EmotionType;
  occasion: OccasionType;
  recipientName: string;
  onComplete: (videoBlob: Blob) => void;
}

const emotionEffects = {
  heartfelt: {
    gradient: ["#E91E63", "#FCE4EC", "#C2185B"],
    animation: "hearts",
  },
  funny: {
    gradient: ["#FF9800", "#FFF3E0", "#F57C00"],
    animation: "bounce",
  },
  elegant: {
    gradient: ["#9C27B0", "#F3E5F5", "#7B1FA2"],
    animation: "sparkles",
  },
  cinematic: {
    gradient: ["#212121", "#FAFAFA", "#FFD700"],
    animation: "flare",
  },
  traditional: {
    gradient: ["#FF5722", "#FBE9E7", "#D84315"],
    animation: "diya",
  },
};

const occasionCaptions = {
  birthday: "Wishing you joy, laughter, and endless blessings",
  diwali: "May the festival of lights illuminate your path",
  anniversary: "Celebrating your beautiful journey together",
  wedding: "Two hearts, one beautiful beginning",
  newyear: "New dreams, new hopes, new beginnings",
  justlove: "Thinking of you with warmth and affection",
};

export function VideoGenerator({
  imageUrl,
  emotion,
  occasion,
  recipientName,
  onComplete,
}: VideoGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    generateVideo();
  }, []);

  const generateVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (9:16 aspect ratio for WhatsApp Status)
    canvas.width = 1080;
    canvas.height = 1920;

    // Load image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Set up MediaRecorder
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 2500000,
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      onComplete(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();

    // Animation parameters
    const fps = 30;
    const duration = 12; // 12 seconds
    const totalFrames = fps * duration;
    let frame = 0;

    const effects = emotionEffects[emotion];
    const caption = occasionCaptions[occasion];

    // Animation loop
    const animate = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, effects.gradient[0]);
      gradient.addColorStop(0.5, effects.gradient[1]);
      gradient.addColorStop(1, effects.gradient[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate animation progress
      const progress = frame / totalFrames;

      // Draw image with zoom effect
      const zoom = 1 + Math.sin(progress * Math.PI) * 0.1;
      const imgWidth = canvas.width * zoom;
      const imgHeight = (img.height / img.width) * imgWidth;
      const imgX = (canvas.width - imgWidth) / 2;
      const imgY = (canvas.height - imgHeight) / 2;

      ctx.save();
      ctx.globalAlpha = Math.min(1, progress * 3);
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      ctx.restore();

      // Draw emotion-specific effects
      drawEmotionEffects(ctx, effects.animation, progress, canvas);

      // Draw caption
      if (progress > 0.3) {
        drawCaption(ctx, caption, recipientName, progress, canvas);
      }

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  };

  const drawEmotionEffects = (
    ctx: CanvasRenderingContext2D,
    animation: string,
    progress: number,
    canvas: HTMLCanvasElement
  ) => {
    ctx.save();

    switch (animation) {
      case "hearts":
        for (let i = 0; i < 10; i++) {
          const x = (canvas.width / 10) * i + Math.sin(progress * 10 + i) * 50;
          const y = canvas.height - progress * canvas.height * 1.2 + i * 100;
          const size = 30 + Math.sin(progress * 5 + i) * 10;
          drawHeart(ctx, x, y, size);
        }
        break;

      case "bounce":
        for (let i = 0; i < 8; i++) {
          const x = (canvas.width / 8) * i;
          const y =
            canvas.height * 0.2 +
            Math.abs(Math.sin(progress * 10 + i * 0.5)) * 100;
          ctx.font = "60px Arial";
          ctx.fillText(["🎉", "😄", "🎈", "⭐"][i % 4], x, y);
        }
        break;

      case "sparkles":
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = 5 + Math.random() * 10;
          const opacity = Math.sin(progress * 20 + i) * 0.5 + 0.5;
          ctx.globalAlpha = opacity;
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case "flare":
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#FFD700";
        const flareX = canvas.width * progress;
        const flareGradient = ctx.createRadialGradient(
          flareX,
          canvas.height / 2,
          0,
          flareX,
          canvas.height / 2,
          300
        );
        flareGradient.addColorStop(0, "rgba(255, 215, 0, 0.8)");
        flareGradient.addColorStop(1, "rgba(255, 215, 0, 0)");
        ctx.fillStyle = flareGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;

      case "diya":
        for (let i = 0; i < 5; i++) {
          const x = (canvas.width / 6) * (i + 1);
          const y = canvas.height * 0.9;
          const flicker = Math.sin(progress * 30 + i) * 5;
          ctx.font = "80px Arial";
          ctx.save();
          ctx.translate(x, y + flicker);
          ctx.fillText("🪔", 0, 0);
          ctx.restore();
        }
        break;
    }

    ctx.restore();
  };

  const drawHeart = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.save();
    ctx.fillStyle = "#E91E63";
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(
      x,
      y,
      x - size / 2,
      y,
      x - size / 2,
      y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x - size / 2,
      y + (size + topCurveHeight) / 2,
      x,
      y + (size + topCurveHeight) / 1.5,
      x,
      y + size
    );
    ctx.bezierCurveTo(
      x,
      y + (size + topCurveHeight) / 1.5,
      x + size / 2,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x + size / 2,
      y,
      x,
      y,
      x,
      y + topCurveHeight
    );
    ctx.fill();
    ctx.restore();
  };

  const drawCaption = (
    ctx: CanvasRenderingContext2D,
    caption: string,
    recipientName: string,
    progress: number,
    canvas: HTMLCanvasElement
  ) => {
    ctx.save();
    const opacity = Math.min(1, (progress - 0.3) * 2);
    ctx.globalAlpha = opacity;

    // Draw recipient name if provided
    if (recipientName) {
      ctx.font = "bold 70px Inter, Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText(recipientName, canvas.width / 2, canvas.height * 0.15);
    }

    // Draw caption
    ctx.font = "50px Inter, Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 15;

    // Word wrap caption
    const words = caption.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    const maxWidth = canvas.width * 0.85;

    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    const lineHeight = 70;
    const startY = canvas.height * 0.8;
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
    });

    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "none" }}
      width={1080}
      height={1920}
    />
  );
}
