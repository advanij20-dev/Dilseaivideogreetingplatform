# Architecture Diagrams & Visual Flow

## 1. Component Hierarchy Tree

```
App.tsx (Root - State Management)
├── currentStep: "upload" | "emotion" | "occasion" | "generate"
├── uploadedFile: File | null
├── uploadedImageUrl: string
├── selectedEmotion: EmotionType | null
├── selectedOccasion: OccasionType | null
├── recipientName: string
│
├─ UploadPhotoStep [if step === "upload"]
│  ├── Props: onPhotoUploaded()
│  └── Local State: isDragging
│
├─ ChooseEmotionStep [if step === "emotion"]
│  ├── Props: selectedEmotion, onEmotionSelected(), onNext(), onBack(), uploadedImage
│  └── Renders: 5 emotion cards
│
├─ ChooseOccasionStep [if step === "occasion"]
│  ├── Props: selectedOccasion, onOccasionSelected(), recipientName, onRecipientNameChange(), onNext(), onBack()
│  └── Renders: 6 occasion cards, Input for name
│
├─ GenerateShareStep [if step === "generate"]
│  ├── Props: uploadedImage, emotion, occasion, recipientName, onCreateAnother()
│  ├── Local State: progress, isComplete, currentMessage, videoBlob, videoUrl
│  │
│  ├─ VideoGenerator (Hidden Canvas)
│  │  ├── Props: imageUrl, emotion, occasion, recipientName, onComplete()
│  │  └── Output: Renders video to canvas, calls onComplete(blob)
│  │
│  └─ VideoPlayer [if isComplete]
│     ├── Props: videoUrl, autoPlay
│     └── Local State: isPlaying, isMuted, progress
│
└─ Toaster (Global notification)
   └── Position: top-center
```

---

## 2. Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│                    (Central State Hub)                           │
│                                                                  │
│  State Variables:                                               │
│  • currentStep: Step                                            │
│  • uploadedFile: File | null                                    │
│  • uploadedImageUrl: string                                     │
│  • selectedEmotion: EmotionType | null                          │
│  • selectedOccasion: OccasionType | null                        │
│  • recipientName: string                                        │
└──────────────────────────────────────────────────────────────────┘
              ↓↑ Props & Callbacks
    ┌─────────┴─────────────────────────────────────┬──────────────┐
    ↓                                               ↓              ↓
┌─────────────────┐                  ┌──────────────────┐   ┌──────────────┐
│ UploadPhotoStep │                  │ChooseEmotionStep │   │ChooseOccasi… │
│                 │                  │                  │   │               │
│ Props:          │                  │ Props:           │   │ Props:        │
│ • onPhotoUp…()  │────→ File Upload │ • selectedEmotion    │ • selectedOcc…
│                 │────→ URL.create… │ • onEmotionSel…()    │ • onOccasionSe
│ Returns:        │                  │ • uploadedImage      │ • recipientN…
│ • setCurrentStep│                  │                  │   │ • onRecipien…
│ • setUploadedF… │                  │ Returns:         │   │
│ • setUploadedI… │                  │ • setCurrentStep │   │ Returns:
│                 │                  │ • setSelectedEmo │   │ • setCurrentStep
└─────────────────┘                  │                  │   │ • setSelectedOcc
                                     └──────────────────┘   │ • setRecipientN
                                                             └──────────────┘
                                                                    ↓
                                                    ┌────────────────────────────────┐
                                                    │ GenerateShareStep              │
                                                    │                                │
                                                    │ Receives:                      │
                                                    │ • uploadedImage                │
                                                    │ • emotion                      │
                                                    │ • occasion                     │
                                                    │ • recipientName                │
                                                    │                                │
                                                    │ Contains:                      │
                                                    │ ├─ VideoGenerator (Canvas)    │
                                                    │ │  └─ Generates Blob           │
                                                    │ └─ VideoPlayer                │
                                                    │    └─ Plays generated video    │
                                                    └────────────────────────────────┘
```

---

## 3. User Journey & Navigation Flow

```
START
  │
  ├─ User visits site
  │  └─ App.tsx renders
  │
  ├─ currentStep = "upload"
  │  ├─ UploadPhotoStep renders
  │  │  └─ User uploads photo
  │  │     └─ onPhotoUploaded() called
  │  │        ├─ setUploadedFile(file)
  │  │        ├─ setUploadedImageUrl(URL)
  │  │        └─ setCurrentStep("emotion")
  │
  ├─ currentStep = "emotion"
  │  ├─ ChooseEmotionStep renders
  │  │  ├─ Shows 5 emotion cards
  │  │  ├─ Shows circular preview of uploaded photo
  │  │  │
  │  │  ├─ Back Button → setCurrentStep("upload")
  │  │  │
  │  │  └─ Next Button (disabled until emotion selected)
  │  │     └─ onEmotionSelected() called
  │  │        ├─ setSelectedEmotion(emotion)
  │  │        └─ setCurrentStep("occasion")
  │
  ├─ currentStep = "occasion"
  │  ├─ ChooseOccasionStep renders
  │  │  ├─ Shows 6 occasion cards
  │  │  ├─ Shows caption preview
  │  │  ├─ Shows recipient name input
  │  │  │
  │  │  ├─ Back Button → setCurrentStep("emotion")
  │  │  │
  │  │  └─ Next Button (disabled until occasion selected)
  │  │     ├─ onOccasionSelected() called
  │  │     ├─ setSelectedOccasion(occasion)
  │  │     ├─ (recipientName set via onRecipientNameChange)
  │  │     └─ setCurrentStep("generate")
  │
  ├─ currentStep = "generate" && !isComplete
  │  ├─ GenerateShareStep renders with progress UI
  │  │  ├─ VideoGenerator renders (hidden canvas)
  │  │  │  └─ Animates canvas for 12 seconds
  │  │  │     ├─ Gradient background (emotion-based)
  │  │  │     ├─ Zoom animation with image
  │  │  │     ├─ Emotion-specific effects (hearts, sparks, etc)
  │  │  │     ├─ Captions (recipient name, occasion message)
  │  │  │     └─ Captures to WebM blob
  │  │  │
  │  │  ├─ Shows progress bar (0-100%)
  │  │  ├─ Shows animated progress messages
  │  │  └─ Simulated progress (35-45 seconds)
  │  │     └─ onComplete(videoBlob) called
  │  │        ├─ setVideoBlob(blob)
  │  │        ├─ setVideoUrl(objectURL)
  │  │        ├─ setIsComplete(true)
  │  │        ├─ setProgress(100)
  │  │        └─ toast.success("Video ready!")
  │
  └─ currentStep = "generate" && isComplete
     ├─ GenerateShareStep renders with video player
     │  ├─ VideoPlayer
     │  │  └─ Shows generated video with controls
     │  │
     │  ├─ Video Details Card
     │  │  └─ Shows duration, format, emotion, occasion, recipient
     │  │
     │  ├─ Share Buttons:
     │  │  ├─ "Share on WhatsApp" (primary, green)
     │  │  │  └─ navigator.share() or WhatsApp link
     │  │  ├─ "Download Video"
     │  │  │  └─ Downloads WebM file
     │  │  └─ Social Buttons (Facebook, Instagram, Twitter)
     │  │
     │  └─ "Create Another Video"
     │     └─ handleCreateAnother()
     │        ├─ setCurrentStep("upload")
     │        ├─ setUploadedFile(null)
     │        ├─ setUploadedImageUrl("")
     │        ├─ setSelectedEmotion(null)
     │        ├─ setSelectedOccasion(null)
     │        ├─ setRecipientName("")
     │        └─ Back to START
     │
END
```

---

## 4. State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    App.tsx State Variables                   │
└─────────────────────────────────────────────────────────────┘

1. currentStep: "upload" | "emotion" | "occasion" | "generate"
   ├─ Updated by: handlePhotoUploaded(), handleEmotionNext(), etc.
   └─ Used by: Conditional rendering (if currentStep === "X")

2. uploadedFile: File | null
   ├─ Set by: handlePhotoUploaded()
   ├─ Reset by: handleCreateAnother()
   └─ Passed to: (Not directly used in render, URL version used)

3. uploadedImageUrl: string
   ├─ Set by: handlePhotoUploaded() via URL.createObjectURL()
   ├─ Passed to: ChooseEmotionStep (uploadedImage prop)
   │            └─ Used for circular preview
   ├─ Passed to: GenerateShareStep (uploadedImage prop)
   │            └─ Passed to VideoGenerator
   │               └─ Drawn on canvas
   └─ Reset by: handleCreateAnother()

4. selectedEmotion: EmotionType | null
   ├─ Set by: onEmotionSelected() (ChooseEmotionStep)
   ├─ Passed to: GenerateShareStep
   │            └─ Passed to VideoGenerator
   │               ├─ emotionEffects[emotion] → gradient colors
   │               └─ emotionEffects[emotion] → animation type
   ├─ Used for: Next button disabled state
   └─ Reset by: handleCreateAnother()

5. selectedOccasion: OccasionType | null
   ├─ Set by: onOccasionSelected() (ChooseOccasionStep)
   ├─ Passed to: GenerateShareStep
   │            └─ Passed to VideoGenerator
   │               ├─ occasionCaptions[occasion] → caption text
   │               └─ Used in download/share messages
   ├─ Used for: Next button disabled state
   └─ Reset by: handleCreateAnother()

6. recipientName: string
   ├─ Set by: onRecipientNameChange() (ChooseOccasionStep input)
   ├─ Passed to: GenerateShareStep
   │            └─ Passed to VideoGenerator
   │               └─ Drawn as top text in video
   ├─ Used for: Share message customization
   └─ Reset by: handleCreateAnother()
```

---

## 5. Video Generation Process (Canvas + MediaRecorder)

```
VideoGenerator Component
│
├─ useEffect (on mount)
│  └─ generateVideo()
│
├─ 1. Canvas Setup
│  ├─ Create canvas 1080x1920 (9:16 ratio)
│  └─ Load image from uploadedImageUrl
│
├─ 2. MediaRecorder Setup
│  ├─ Get stream from canvas.captureStream(30 FPS)
│  ├─ Create MediaRecorder with WebM/VP9 codec
│  ├─ On ondataavailable → push chunks to array
│  └─ On onstop → create Blob, call onComplete(blob)
│
├─ 3. Animation Loop (12 seconds, 360 frames at 30 FPS)
│  │
│  └─ For each frame:
│     │
│     ├─ Draw gradient background (emotion-based 3-color gradient)
│     │  └─ Vertical linear gradient
│     │
│     ├─ Calculate animation progress (0.0 to 1.0)
│     │
│     ├─ Draw image with zoom effect
│     │  ├─ Zoom: 1 + sin(progress * PI) * 0.1
│     │  ├─ Center on canvas
│     │  ├─ Fade in over first 30% of animation
│     │  └─ Draw using ctx.drawImage()
│     │
│     ├─ Draw emotion-specific effects
│     │  ├─ "hearts" → Floating heart shapes
│     │  ├─ "bounce" → Bouncing emoji animation
│     │  ├─ "sparkles" → Random particle effects
│     │  ├─ "flare" → Moving lens flare
│     │  └─ "diya" → Flickering oil lamps
│     │
│     ├─ Draw text (if progress > 0.3)
│     │  ├─ Recipient name (bold, 70px, top area)
│     │  ├─ Caption text (50px, word-wrapped, bottom area)
│     │  ├─ White color with shadow
│     │  └─ Fade in effect
│     │
│     └─ requestAnimationFrame() → next frame
│
├─ 4. Recording Complete
│  └─ mediaRecorder.stop()
│     └─ Blob → onComplete() callback
│
└─ Return: Hidden canvas element
```

---

## 6. UI Component Hierarchy (Radix UI + Tailwind)

```
Radix UI Primitives                Wrapper Components (src/components/ui/)
├─ Button Primitive      →         Button (with CVA variants)
├─ Card Primitive        →         Card, CardHeader, CardContent, etc.
├─ Input Primitive       →         Input (text input)
├─ Label Primitive       →         Label
├─ Dialog Primitive      →         Dialog, DialogContent, etc.
├─ AlertDialog Primitive →         AlertDialog
├─ Select Primitive      →         Select
├─ Tabs Primitive        →         Tabs, TabsContent, TabsList
├─ Dropdown Primitive    →         DropdownMenu
├─ Navigation Primitive  →         NavigationMenu
├─ Slider Primitive      →         Slider
├─ Progress Primitive    →         Progress
├─ Toggle Primitive      →         Toggle
├─ Checkbox Primitive    →         Checkbox
├─ Radio Primitive       →         RadioGroup
├─ Tooltip Primitive     →         Tooltip, TooltipProvider
├─ Popover Primitive     →         Popover
├─ Collapsible Primitive →         Collapsible
├─ Accordion Primitive   →         Accordion
├─ ContextMenu Primitive →         ContextMenu
├─ Scroll Primitive      →         ScrollArea
├─ Carousel Primitive    →         Carousel
└─ [more...]

Styling Applied to All:
├─ Tailwind CSS classes
├─ CVA (Class Variance Authority) for component variants
├─ Custom className prop for overrides
└─ cn() utility for merging Tailwind classes
```

---

## 7. File Dependencies Graph

```
main.tsx
  ├─ App.tsx (root)
  │  ├─ UploadPhotoStep.tsx
  │  │  ├─ Button (ui/button.tsx)
  │  │  ├─ Card (ui/card.tsx)
  │  │  └─ Icons (lucide-react)
  │  │
  │  ├─ ChooseEmotionStep.tsx
  │  │  ├─ Card (ui/card.tsx)
  │  │  ├─ Button (ui/button.tsx)
  │  │  └─ Icons (lucide-react)
  │  │
  │  ├─ ChooseOccasionStep.tsx
  │  │  ├─ Card (ui/card.tsx)
  │  │  ├─ Button (ui/button.tsx)
  │  │  ├─ Input (ui/input.tsx)
  │  │  ├─ Label (ui/label.tsx)
  │  │  └─ Icons (lucide-react)
  │  │
  │  ├─ GenerateShareStep.tsx
  │  │  ├─ VideoGenerator.tsx (canvas, MediaRecorder)
  │  │  │  ├─ (No dependencies, uses Canvas API)
  │  │  │  └─ Returns Blob via callback
  │  │  │
  │  │  ├─ VideoPlayer.tsx
  │  │  │  ├─ Button (ui/button.tsx)
  │  │  │  └─ Icons (lucide-react)
  │  │  │
  │  │  ├─ Card (ui/card.tsx)
  │  │  ├─ Button (ui/button.tsx)
  │  │  ├─ Progress (ui/progress.tsx)
  │  │  ├─ Icons (lucide-react)
  │  │  └─ Toast (sonner)
  │  │
  │  ├─ Toaster (ui/sonner.tsx)
  │  │  └─ sonner library
  │  │
  │  └─ Types
  │     ├─ EmotionType (from ChooseEmotionStep.tsx)
  │     └─ OccasionType (from ChooseOccasionStep.tsx)
  │
  └─ index.css (Tailwind compiled)

ui/utils.ts
  ├─ clsx (utility)
  └─ tailwind-merge (utility)
     └─ Used by: all ui components via cn()
```

---

## 8. 2-Step Redesign: Component Consolidation Map

```
CURRENT ARCHITECTURE (4 Steps)
┌────────────────────────────────────────────────────────────────┐
│ Step 1: UploadPhotoStep    │ Step 2: ChooseEmotionStep        │
│  - File upload             │  - Emotion selection             │
│  - Drag & drop             │  - Preview image                 │
│  - Camera capture          │  - 5 emotion cards               │
│  - Pro tips                │                                  │
├────────────────────────────────────────────────────────────────┤
│ Step 3: ChooseOccasionStep │ Step 4: GenerateShareStep        │
│  - Occasion selection      │  - Video generation              │
│  - Caption preview         │  - Video player                  │
│  - Recipient name input    │  - Share/Download buttons        │
│                            │  - Create another button         │
└────────────────────────────────────────────────────────────────┘

NEW ARCHITECTURE (2 Steps - PROPOSED)
┌────────────────────────────────────────────────────────────────┐
│                    NEW STEP 1                                  │
│      SelectPhotoEmotionStep (MERGED)                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Top Section:                                             │ │
│  │  • File upload (drag & drop, gallery, camera)           │ │
│  │  • Pro tips card                                         │ │
│  │                                                          │ │
│  │ Bottom Section:                                          │ │
│  │  • Emotion selector (5 cards with preview)              │ │
│  │  • Next button (disabled until emotion selected)        │ │
│  └──────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────┤
│                    NEW STEP 2                                  │
│    SelectDetailsGenerateStep (MERGED)                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Selection Section:                                       │ │
│  │  • 6 occasion cards                                      │ │
│  │  • Caption preview                                       │ │
│  │  • Recipient name input                                  │ │
│  │                                                          │ │
│  │ Generation/Output Section:                               │ │
│  │  • Progress bar (0-100%) OR Video player                │ │
│  │  • Share buttons                                         │ │
│  │  • Download button                                       │ │
│  │  • Create another button                                │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘

REUSABLE COMPONENTS
├─ VideoGenerator.tsx (NO CHANGES)
├─ VideoPlayer.tsx (NO CHANGES)
├─ ui/* components (NO CHANGES)
├─ Types (EmotionType, OccasionType) (NO CHANGES)
└─ App.tsx (SIMPLIFIED)
   └─ currentStep type: "select" | "details" | "generate"
   └─ Fewer handlers
   └─ Same state variables
```

---

## 9. Key Takeaways for Redesign

### What Stays the Same
- VideoGenerator.tsx (logic unchanged)
- VideoPlayer.tsx (no changes needed)
- All ui/ components (reusable)
- Emotion & Occasion data structures
- State variables (can stay as-is)
- Toast notifications
- Canvas video generation process

### What Changes
- Component count: 4 → 2 (combining steps)
- Step type: 4 values → 2-3 values
- Navigation handlers: 3 → 1-2
- Conditional rendering: 4 conditions → 2-3 conditions

### Complexity Reduction
- From 4 separate step files → 2 larger files
- From 4 step-specific handlers → Combined handlers
- From 4 step indicators → 2 step indicators
- UI can be more streamlined (horizontal layouts, multi-column)

### Flexibility Gains
- Can adjust step 1 height/width freely
- Can adjust step 2 layout (split pane optional)
- More room for design iteration
- Easier to test 2-step flow

