# 🎥 Dilse.ai - AI Video Greeting Platform

Transform a single photo into a beautiful 10-15 second emotional greeting video in under 60 seconds!

[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

## ✨ Features

### 📸 Photo Upload & Processing
- **Smart Upload**: Drag-and-drop, gallery selection, or direct camera capture
- **AI Face Detection**: Automatic face recognition using face-api.js
- **Auto-Crop**: Intelligent cropping to 9:16 aspect ratio for WhatsApp Status
- **Quality Validation**: Ensures optimal image quality and dimensions
- **Real-time Preview**: See your processed photo instantly

### 🎭 Emotion Selection
Choose from 5 beautifully crafted emotion styles:
- **💝 Heartfelt**: Floating hearts with warm gradients
- **😄 Funny**: Bouncing emojis and playful animations
- **✨ Elegant**: Sparkling particles and graceful movements
- **🎬 Cinematic**: Dramatic lens flares and epic effects
- **🪔 Traditional**: Diya lamps and cultural motifs

### 🎉 Occasion Templates
Pre-designed captions for 6 special occasions:
- Birthday
- Diwali
- Anniversary
- Wedding
- New Year
- Just Love

### 🎨 Video Generation
- **Canvas-based Rendering**: High-quality 1080x1920 (9:16) video
- **30 FPS Smooth Animations**: Professional-grade motion graphics
- **12-Second Duration**: Perfect for social media sharing
- **Dynamic Effects**: Emotion-specific animations and transitions
- **Text Overlays**: Personalized recipient name and captions
- **Background Music**: Emotion-matched audio tracks (Howler.js)

### 📤 Share & Export
- **WhatsApp Share**: One-tap sharing via Web Share API
- **Download**: Save as WebM format
- **Social Media**: Share to Facebook, Instagram, Twitter
- **Preview Player**: Custom video player with music controls

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with Canvas API support

### Installation

```bash
# Clone the repository
git clone https://github.com/advanij20-dev/Dilseaivideogreetingplatform.git
cd Dilseaivideogreetingplatform

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── UploadPhotoStep.tsx       # Photo upload with face detection
│   ├── ChooseEmotionStep.tsx     # Emotion selection UI
│   ├── ChooseOccasionStep.tsx    # Occasion selection UI
│   ├── GenerateShareStep.tsx     # Video generation & sharing
│   ├── VideoGenerator.tsx        # Canvas-based video rendering
│   ├── VideoPlayer.tsx           # Custom video player with music
│   ├── ErrorBoundary.tsx         # Error handling component
│   └── ui/                       # 50+ shadcn/ui components
├── utils/
│   ├── faceDetection.ts          # Face detection using face-api.js
│   ├── imageProcessing.ts        # Image validation & auto-crop
│   └── audioManager.ts           # Background music management
├── App.tsx                       # Main app flow
├── main.tsx                      # App entry point
└── index.css                     # Tailwind styles

```

## 🎯 How It Works

### Step 1: Photo Upload
1. User uploads photo (drag-drop/gallery/camera)
2. Image is validated for quality and dimensions
3. Face detection runs in background
4. Auto-crop to 9:16 aspect ratio focusing on detected face
5. Preview shown with validation feedback

### Step 2: Emotion Selection
User selects one of 5 emotion styles that determines:
- Animation style (hearts, sparkles, flares, etc.)
- Color gradient scheme
- Background music track

### Step 3: Occasion & Personalization
- Select occasion (Birthday, Diwali, etc.)
- Enter optional recipient name
- Caption automatically generated

### Step 4: Video Generation
1. Canvas initialized at 1080x1920 resolution
2. 360 frames rendered at 30 FPS (12 seconds)
3. Each frame draws:
   - Gradient background
   - User photo with zoom effect
   - Emotion-specific animations
   - Text overlays (name + caption)
4. MediaRecorder captures canvas stream as WebM
5. Background music loads for playback

### Step 5: Preview & Share
- Custom video player with controls
- Background music synchronized with playback
- Share via WhatsApp, download, or social media

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1**: UI library
- **TypeScript**: Type safety
- **Vite 6.3.5**: Build tool & dev server

### Styling
- **Tailwind CSS 4.1.3**: Utility-first styling
- **shadcn/ui**: 50+ pre-built components
- **Radix UI**: Accessible primitives

### Media Processing
- **face-api.js**: Face detection & landmarks
- **Canvas API**: Video rendering
- **MediaRecorder API**: Video capture
- **Howler.js**: Audio playback

### UI/UX
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **React Hook Form**: Form handling

## 📱 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Canvas API | ✅ | ✅ | ✅ | ✅ |
| MediaRecorder | ✅ | ✅ | ⚠️ (limited) | ✅ |
| Web Share API | ✅ | ❌ | ✅ | ✅ |
| Face Detection | ✅ | ✅ | ✅ | ✅ |

**Recommended**: Chrome/Edge for best experience

## 🎨 Customization

### Add New Emotion
Edit `src/components/VideoGenerator.tsx`:

```typescript
const emotionEffects = {
  yourEmotion: {
    gradient: ["#color1", "#color2", "#color3"],
    animation: "yourAnimation",
  }
};
```

### Add New Occasion
Edit `src/components/VideoGenerator.tsx`:

```typescript
const occasionCaptions = {
  yourOccasion: "Your custom caption text",
};
```

### Change Video Duration
Edit `src/components/VideoGenerator.tsx`:

```typescript
const duration = 15; // Change from 12 to 15 seconds
```

## 🐛 Troubleshooting

### Face Detection Not Working
- Ensure stable internet (models load from CDN)
- Check browser console for CORS errors
- Face detection is optional - videos still generate without it

### Video Generation Slow
- Reduce canvas resolution (currently 1080x1920)
- Decrease FPS from 30 to 24
- Simplify animation effects

### Audio Not Playing
- Check browser audio permissions
- Verify Howler.js loaded correctly
- Music is optional - toggle via player controls

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 License

This project uses:
- **shadcn/ui**: MIT License
- **face-api.js**: MIT License
- **Howler.js**: MIT License
- Music from Mixkit (royalty-free)

## 🙏 Acknowledgments

- Original design from [Figma](https://www.figma.com/design/RS0i9yV0nFkveKp2LOv0ju/Dilse.ai-Video-Greeting-Platform)
- Built with [shadcn/ui](https://ui.shadcn.com)
- Face detection by [face-api.js](https://github.com/vladmandic/face-api)
- Icons by [Lucide](https://lucide.dev)

## 🚧 Future Enhancements

- [ ] Backend API for video processing
- [ ] User authentication & saved videos
- [ ] More emotion styles and animations
- [ ] Custom music upload
- [ ] Video filters and effects
- [ ] Multi-face support
- [ ] MP4 export format
- [ ] Mobile app (React Native)
- [ ] AI-powered voice narration
- [ ] Real-time collaboration

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Open an issue on GitHub

---

Made with ❤️ using React, TypeScript, and Canvas API