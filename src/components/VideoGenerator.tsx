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
        // Floating hearts with varying sizes and opacity
        for (let i = 0; i < 15; i++) {
          const delay = i * 0.05;
          const adjustedProgress = Math.max(0, progress - delay);
          const x = (canvas.width / 15) * i + Math.sin(adjustedProgress * 8 + i) * 60;
          const y = canvas.height - adjustedProgress * canvas.height * 1.3 + (i % 3) * 150;
          const size = 25 + Math.sin(adjustedProgress * 5 + i) * 15;
          const opacity = Math.max(0, 1 - adjustedProgress) * (0.6 + Math.sin(i) * 0.2);
          ctx.globalAlpha = opacity;
          drawHeart(ctx, x, y, size);
        }
        // Add some larger background hearts
        for (let i = 0; i < 5; i++) {
          const x = (canvas.width / 5) * i;
          const y = canvas.height * 0.3 + Math.sin(progress * 3 + i) * 100;
          const size = 40 + Math.sin(progress * 4 + i) * 20;
          ctx.globalAlpha = 0.15;
          drawHeart(ctx, x, y, size);
        }
        break;

      case "bounce":
        // Bouncing emojis with more variety
        const emojis = ["🎉", "😄", "🎈", "⭐", "🎊", "✨", "🎁", "🌟"];
        for (let i = 0; i < 12; i++) {
          const x = (canvas.width / 12) * i + Math.sin(progress * 5 + i) * 40;
          const bounceHeight = Math.abs(Math.sin(progress * 15 + i * 0.7)) * 150;
          const y = canvas.height * 0.3 + bounceHeight;
          const rotation = Math.sin(progress * 10 + i) * 0.3;
          const scale = 0.8 + Math.sin(progress * 8 + i) * 0.3;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);
          ctx.font = "70px Arial";
          ctx.fillText(emojis[i % emojis.length], 0, 0);
          ctx.restore();
        }
        break;

      case "sparkles":
        // Enhanced sparkle effects with different layers
        // Background sparkles (slow moving)
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2 + progress * 2;
          const radius = 200 + Math.sin(progress * 5 + i) * 100;
          const x = canvas.width / 2 + Math.cos(angle) * radius;
          const y = canvas.height / 2 + Math.sin(angle) * radius;
          const size = 3 + Math.sin(progress * 10 + i) * 3;
          const opacity = Math.sin(progress * 15 + i) * 0.5 + 0.5;

          ctx.globalAlpha = opacity * 0.6;
          ctx.fillStyle = "#FFD700";

          // Draw star shape
          drawStar(ctx, x, y, 5, size * 2, size);
        }
        // Foreground sparkles (fast twinkling)
        for (let i = 0; i < 20; i++) {
          const x = (Math.sin(i * 13.7) * 0.5 + 0.5) * canvas.width;
          const y = (Math.cos(i * 17.3) * 0.5 + 0.5) * canvas.height;
          const size = 4 + Math.random() * 8;
          const opacity = Math.abs(Math.sin(progress * 25 + i * 3.7));

          ctx.globalAlpha = opacity;
          ctx.fillStyle = i % 2 === 0 ? "#FFD700" : "#FFFFFF";
          drawStar(ctx, x, y, 4, size * 2.5, size);
        }
        break;

      case "flare":
        // Enhanced cinematic lens flare
        const flareX = canvas.width * progress;
        const flareY = canvas.height / 2 + Math.sin(progress * Math.PI) * 100;

        // Main flare
        const mainFlare = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 400);
        mainFlare.addColorStop(0, "rgba(255, 215, 0, 0.6)");
        mainFlare.addColorStop(0.3, "rgba(255, 165, 0, 0.3)");
        mainFlare.addColorStop(1, "rgba(255, 215, 0, 0)");
        ctx.fillStyle = mainFlare;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Secondary flares
        for (let i = 0; i < 5; i++) {
          const offsetX = flareX - (flareX - canvas.width / 2) * (i * 0.3);
          const offsetY = flareY - (flareY - canvas.height / 2) * (i * 0.3);
          const size = 150 - i * 20;

          const secondaryFlare = ctx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, size);
          secondaryFlare.addColorStop(0, `rgba(255, 255, 255, ${0.2 - i * 0.03})`);
          secondaryFlare.addColorStop(1, "rgba(255, 215, 0, 0)");
          ctx.fillStyle = secondaryFlare;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        break;

      case "diya":
        // Traditional diya lamps with enhanced glow
        for (let i = 0; i < 6; i++) {
          const x = (canvas.width / 7) * (i + 1);
          const baseY = canvas.height * 0.88;
          const flicker = Math.sin(progress * 40 + i * 2.3) * 8;
          const y = baseY + flicker;

          // Glow effect
          const glowGradient = ctx.createRadialGradient(x, y - 30, 0, x, y - 30, 80);
          glowGradient.addColorStop(0, "rgba(255, 165, 0, 0.4)");
          glowGradient.addColorStop(1, "rgba(255, 165, 0, 0)");
          ctx.fillStyle = glowGradient;
          ctx.fillRect(x - 80, y - 110, 160, 160);

          // Diya emoji
          ctx.font = "90px Arial";
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.sin(progress * 30 + i) * 0.05);
          ctx.fillText("🪔", -45, 0);
          ctx.restore();

          // Floating particles
          for (let j = 0; j < 3; j++) {
            const particleProgress = (progress * 2 + i * 0.1 + j * 0.3) % 1;
            const particleX = x + Math.sin(particleProgress * 10) * 30;
            const particleY = y - particleProgress * 200;
            const particleSize = (1 - particleProgress) * 4;
            const particleOpacity = (1 - particleProgress) * 0.8;

            ctx.globalAlpha = particleOpacity;
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
    }

    ctx.restore();
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
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
