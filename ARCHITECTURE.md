# Dilse.ai Video Greeting Platform - Current Architecture Summary

## Overview
The Dilse.ai platform is a React 18 + Vite web application that guides users through a 4-step wizard to create personalized video greetings.

---

## 1. App Structure & Main Entry Points

### File Structure
```
src/
├── main.tsx              # Entry point - renders React app
├── App.tsx              # Root component - manages 4-step flow
├── index.css            # Tailwind CSS (compiled, ~54KB)
├── components/
│   ├── UploadPhotoStep.tsx
│   ├── ChooseEmotionStep.tsx
│   ├── ChooseOccasionStep.tsx
│   ├── GenerateShareStep.tsx
│   ├── VideoGenerator.tsx
│   ├── VideoPlayer.tsx
│   ├── ui/              # 30+ Radix UI wrapper components
│   ├── figma/
│   └── ...
└── styles/
```

### Main Entry Point Flow
- `main.tsx` → `App.tsx` (root component)
- `App.tsx` manages the 4-step wizard using local state
- Each step is a conditional render based on `currentStep` state

---

## 2. The 4-Step Wizard Components

### Step 1: Upload Photo (`UploadPhotoStep.tsx`)
- **Purpose**: Photo upload with drag-drop support
- **Features**:
  - Drag and drop file upload
  - Gallery picker button
  - Camera capture button
  - Pro tips card with guidance
  - Step indicator (Step 1/4)
- **Props**: `onPhotoUploaded(file: File)`
- **State Managed in App**: `uploadedFile`, `uploadedImageUrl`

### Step 2: Emotion Selection (`ChooseEmotionStep.tsx`)
- **Purpose**: Select emotional tone for the video
- **Emotions Available** (EmotionType):
  - `heartfelt` - Warm & emotional (pink/red colors)
  - `funny` - Playful & joyful (orange colors)
  - `elegant` - Sophisticated & refined (purple colors)
  - `cinematic` - Dramatic & epic (dark/gold colors)
  - `traditional` - Cultural & festive (orange/red colors)
- **Features**:
  - 5 emotion cards with gradients and descriptions
  - Preview of uploaded image as circular avatar
  - Shows audio theme and motion style for each emotion
  - Selection ring animation
  - Back/Next buttons
- **Props**: `selectedEmotion`, `onEmotionSelected`, `onNext`, `onBack`, `uploadedImage`
- **State Managed in App**: `selectedEmotion`

### Step 3: Occasion Selection (`ChooseOccasionStep.tsx`)
- **Purpose**: Choose the occasion and optional recipient name
- **Occasions Available** (OccasionType):
  - `birthday` - Birthday greeting
  - `diwali` - Diwali festival greeting
  - `anniversary` - Anniversary greeting
  - `wedding` - Wedding congratulations
  - `newyear` - New Year wishes
  - `justlove` - General "thinking of you" message
- **Features**:
  - 2-column grid of occasion cards
  - Each occasion has unique icon and color
  - Shows caption preview for selected occasion
  - Optional recipient name input field
  - Caption text examples displayed
- **Props**: `selectedOccasion`, `onOccasionSelected`, `recipientName`, `onRecipientNameChange`, `onNext`, `onBack`
- **State Managed in App**: `selectedOccasion`, `recipientName`

### Step 4: Generate & Share (`GenerateShareStep.tsx`)
- **Purpose**: Generate video, preview it, and share/download
- **Two States**:
  - **Generating**: Shows progress bar (0-100%), animated messages, 35-45 seconds
  - **Complete**: Shows video player, sharing options
- **Features**:
  - Video generation progress UI with simulated progress
  - Custom progress messages ("Adding magic...", "Weaving emotions...", etc.)
  - Video player with controls (play, pause, mute, fullscreen)
  - Video details card (duration, format, emotion, occasion)
  - Share buttons:
    - WhatsApp (primary - green button)
    - Download as WebM file
    - Facebook, Instagram, Twitter (fallbacks)
  - "Create Another" button to reset and start over
  - Toast notifications (using Sonner library)

---

## 3. Video Generation Logic (`VideoGenerator.tsx`)

### Overview
- Pure Canvas-based video generation using MediaRecorder API
- No external video encoding libraries
- Generates 12-second videos at 9:16 aspect ratio (1080x1920px)
- WebM format with VP9 codec

### Process
1. **Canvas Setup**:
   - Creates 1080x1920px canvas (9:16 WhatsApp Status ratio)
   - Loads user's uploaded image

2. **MediaRecorder Setup**:
   - Captures canvas stream at 30 FPS
   - WebM/VP9 codec, 2.5 Mbps bitrate
   - Records video blob

3. **Animation Loop** (12 seconds, 360 frames):
   - Gradient background based on emotion (3 colors)
   - Image zoom effect (1.0x to 1.1x scaling)
   - Emotion-specific effects overlay:
     - **Hearts** (heartfelt): Floating hearts animation
     - **Bounce** (funny): Bouncing emojis (🎉😄🎈⭐)
     - **Sparkles** (elegant): Particle effects
     - **Flare** (cinematic): Gold lens flare sweep
     - **Diya** (traditional): Flickering oil lamp emojis 🪔
   - Text overlay (caption + optional recipient name)

4. **Text Rendering**:
   - Recipient name (70px bold, white, top area)
   - Occasion caption (50px, white, bottom area, word-wrapped)
   - Text shadow for readability
   - Fade-in animation (starts at 30% progress)

5. **Callbacks**:
   - `onComplete(blob: Blob)` called when video finishes

### Emotion Effects Mapping
```javascript
const emotionEffects = {
  heartfelt: { gradient: [#E91E63, #FCE4EC, #C2185B], animation: "hearts" },
  funny: { gradient: [#FF9800, #FFF3E0, #F57C00], animation: "bounce" },
  elegant: { gradient: [#9C27B0, #F3E5F5, #7B1FA2], animation: "sparkles" },
  cinematic: { gradient: [#212121, #FAFAFA, #FFD700], animation: "flare" },
  traditional: { gradient: [#FF5722, #FBE9E7, #D84315], animation: "diya" },
}
```

### Occasion Captions (hardcoded)
```javascript
const occasionCaptions = {
  birthday: "Wishing you joy, laughter, and endless blessings",
  diwali: "May the festival of lights illuminate your path",
  anniversary: "Celebrating your beautiful journey together",
  wedding: "Two hearts, one beautiful beginning",
  newyear: "New dreams, new hopes, new beginnings",
  justlove: "Thinking of you with warmth and affection",
}
```

---

## 4. State Management Approach

### Current Approach: Local Component State Only
- **No Redux, Zustand, MobX, or Context API** (except in sidebar.tsx)
- **Simple useState pattern** in App.tsx

### State Variables (in App.tsx)
```typescript
const [currentStep, setCurrentStep] = useState<Step>("upload");
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | null>(null);
const [recipientName, setRecipientName] = useState("");
```

### Step Type
```typescript
type Step = "upload" | "emotion" | "occasion" | "generate";
```

### Data Flow
- Props drilling from App → Step components
- Callbacks passed down to handle state changes
- No global state, no props tunneling issues currently

### Characteristics
- ✅ Simple, easy to understand
- ✅ No dependencies on state libraries
- ✅ Direct prop passing
- ❌ Would become complex with deeper component nesting
- ❌ Hard to share state between distant components

---

## 5. Component Architecture & Styling

### Component Library: Radix UI + Class Variance Authority (CVA)
- **30+ pre-built Radix UI components** wrapped in custom TSX files
- Components include: Button, Card, Dialog, Dropdown, Input, Label, Select, Tabs, etc.
- Located in: `src/components/ui/`

### Styling Approach: Tailwind CSS v4
- **Utility-first CSS framework**
- Compiled into single `index.css` file (54KB)
- Colors use OKLch color space
- Custom property aliases for spacing, fonts, etc.

### Styling Patterns
1. **Gradient Backgrounds**:
   ```html
   className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
   ```

2. **Responsive Classes**:
   ```html
   className="grid grid-cols-1 gap-4 md:grid-cols-2"
   ```

3. **Class Merging**:
   - Uses `clsx` and `tailwind-merge` for conditional styles
   - Utility: `cn()` function in `ui/utils.tsx`

4. **Component Variants** (CVA):
   ```typescript
   const buttonVariants = cva("base-classes", {
     variants: {
       variant: { default: "...", outline: "...", ... },
       size: { default: "...", sm: "...", ... }
     }
   });
   ```

### Color Scheme
- **Primary Colors**: Purple (#6B46C1), Orange (#FF6B35)
- **Emotion Colors**: Pink, Orange, Purple, Dark+Gold, Orange-Red
- **Gradients**: Extensive use for cards, buttons, backgrounds
- **Light/Dark**: Not implemented (light mode only)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Uses Tailwind's responsive modifiers (md:, lg:, etc.)

### Animation & Effects
- Tailwind animations: scale, bounce, pulse, fade
- Custom CSS: not visible (generated by Tailwind)
- Canvas-based animations in VideoGenerator

### UI Component Example Structure
```typescript
// ui/button.tsx
const buttonVariants = cva("...", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", lg: "..." }
  }
});

function Button({ className, variant, size, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))}>
      {/* content */}
    </button>
  );
}
```

---

## 6. Routing & Navigation Logic

### Current Approach: Step-Based Navigation (No Router)
- **No React Router or Next.js routing**
- **Manual step management** via `currentStep` state
- **Conditional rendering** in App.tsx

### Navigation Flow
```
Upload (Step 1)
  ↓ onPhotoUploaded
Emotion (Step 2)
  ↓ handleEmotionNext (if emotion selected)
Occasion (Step 3)
  ↓ handleOccasionNext (if occasion selected)
Generate (Step 4)
  ↓ handleCreateAnother (reset all)
Back to Upload
```

### Navigation Handlers (in App.tsx)
```typescript
const handlePhotoUploaded = (file: File) => {
  setUploadedFile(file);
  const imageUrl = URL.createObjectURL(file);
  setUploadedImageUrl(imageUrl);
  setCurrentStep("emotion");
};

const handleEmotionNext = () => {
  if (selectedEmotion) setCurrentStep("occasion");
};

const handleOccasionNext = () => {
  if (selectedOccasion) setCurrentStep("generate");
};

const handleCreateAnother = () => {
  // Reset all state
  setCurrentStep("upload");
  setUploadedFile(null);
  setUploadedImageUrl("");
  setSelectedEmotion(null);
  setSelectedOccasion(null);
  setRecipientName("");
};
```

### Back Navigation
- Each step (except upload) has back button
- Back buttons call `setCurrentStep(previousStep)`
- Back buttons passed via props: `onBack={() => setCurrentStep("emotion")}`

### Validation
- Buttons disabled until required selection made
- Emotion and Occasion steps: Next button disabled if nothing selected
- Upload step: Automatically advances on file select

### UI Location of Navigation
- **Upload**: No navigation (auto-advance on file select)
- **Emotion**: Fixed bottom bar with Back/Next buttons
- **Occasion**: Fixed bottom bar with Back/Next buttons
- **Generate**: Action buttons in card (WhatsApp, Download, Create Another)

---

## 7. Supporting Utilities & Components

### VideoPlayer Component (`VideoPlayer.tsx`)
- Custom video player wrapper
- Controls: Play/Pause, Mute/Unmute, Fullscreen, Progress scrubbing
- 9:16 aspect ratio with rounded corners
- Hover-activated controls
- Gradient progress bar

### Types & Interfaces
- `EmotionType`: Union type of 5 emotion strings
- `OccasionType`: Union type of 6 occasion strings
- Emotion & Occasion interfaces describe full options

### Toast Notifications
- Library: `sonner` v2.0.3
- Usage: `toast.success()`, `toast.error()`, `toast.info()`
- Position: `top-center`
- Used for: Video ready, download complete, share errors

### Utility Files
- `src/components/ui/utils.ts`: Contains `cn()` function (tailwind-merge wrapper)
- `src/components/ui/sonner.tsx`: Toaster component export

---

## 8. Dependencies & Tech Stack

### Core
- React 18.3.1
- React DOM 18.3.1
- Vite 6.3.5 (build tool)
- TypeScript (implied, .tsx files)

### UI & Styling
- Tailwind CSS 4.x (compiled)
- Radix UI 1.x (30+ components)
- Lucide React 0.487.0 (icons: Upload, Heart, Smile, Sparkles, Film, etc.)
- Class Variance Authority 0.7.1 (component variants)
- clsx & tailwind-merge (utilities)

### Features
- Sonner 2.0.3 (toast notifications)
- React Hook Form 7.55.0 (form handling)
- Next Themes 0.4.6 (theme management, not used)

### Media
- Canvas API (native - video generation)
- MediaRecorder API (native - video encoding)
- File API (native - uploads)
- Web Share API (native - sharing)

### Development
- @vitejs/plugin-react-swc 3.10.2
- TypeScript types for Node

---

## 9. Build & Deployment

### Build Configuration (vite.config.ts)
```typescript
- Build target: ESNext
- Output dir: build/
- Dev server: port 3000, auto-open
- Extensive Vite alias configuration for dependencies
```

### Package Scripts
```json
"dev": "vite"
"build": "vite build"
```

### Output
- Single-page application (SPA)
- No server-side rendering
- Client-side video generation only

---

## 10. Key Insights for Redesign to 2-Step Flow

### Current Complexity
- 4 separate step components
- Complex state management spread across App.tsx
- Multiple validators and navigation handlers

### Consolidation Opportunities
1. **Step 1 (Upload) + Step 2 (Emotion) → New Step 1**
   - Combine photo upload with emotion picker in same screen
   - Show emotion options with preview
   
2. **Step 3 (Occasion) + Step 4 (Generate) → New Step 2**
   - Combined occasion selection, name input, and video generation
   - Single flow for customization and output

### Migration Path
1. Create 2 new components:
   - `SelectPhotoEmotionStep.tsx` (combines Upload + Emotion)
   - `SelectDetailsGenerateStep.tsx` (combines Occasion + Generate)

2. Update App.tsx:
   - Reduce state type: `type Step = "select" | "details"`
   - Simplify navigation

3. Reuse existing:
   - VideoGenerator (no changes)
   - VideoPlayer (no changes)
   - UI components (no changes)
   - Toast notifications (no changes)

4. Update types:
   - Keep EmotionType and OccasionType
   - No state management changes needed yet

---

## Summary Table

| Aspect | Current Implementation |
|--------|----------------------|
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS v4 + Radix UI |
| **State Management** | Local useState (no Redux/Context) |
| **Routing** | Manual step-based (no router) |
| **Video Generation** | Canvas + MediaRecorder (client-side) |
| **Video Format** | WebM VP9, 9:16 ratio, 12 seconds |
| **UI Pattern** | Component + Props drilling |
| **Form Handling** | React Hook Form 7.55 (available, not heavily used) |
| **Icons** | Lucide React |
| **Notifications** | Sonner Toast |
| **API Integrations** | Web Share API only |
| **Database** | None (client-side only) |
| **Build Output** | Single-page HTML/JS/CSS app |

