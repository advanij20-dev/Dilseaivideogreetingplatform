import * as faceapi from 'face-api.js';

let modelsLoaded = false;

/**
 * Load face detection models
 * Models are loaded from public CDN
 */
export async function loadFaceDetectionModels(): Promise<void> {
  if (modelsLoaded) return;

  try {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);

    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw new Error('Failed to load face detection models');
  }
}

/**
 * Detect faces in an image
 * Returns face detection results with landmarks
 */
export async function detectFaces(imageElement: HTMLImageElement) {
  if (!modelsLoaded) {
    await loadFaceDetectionModels();
  }

  try {
    const detections = await faceapi
      .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      }))
      .withFaceLandmarks();

    return detections;
  } catch (error) {
    console.error('Error detecting faces:', error);
    return [];
  }
}

/**
 * Check if image has at least one clear face
 */
export async function hasValidFace(imageElement: HTMLImageElement): Promise<{
  isValid: boolean;
  faceCount: number;
  confidence?: number;
}> {
  const detections = await detectFaces(imageElement);

  if (detections.length === 0) {
    return { isValid: false, faceCount: 0 };
  }

  // Get the most confident detection
  const bestDetection = detections.reduce((prev, current) =>
    (prev.detection.score > current.detection.score) ? prev : current
  );

  return {
    isValid: true,
    faceCount: detections.length,
    confidence: bestDetection.detection.score
  };
}

/**
 * Get face bounding box for cropping
 * Returns the bounding box of the primary face with some padding
 */
export async function getFaceBoundingBox(imageElement: HTMLImageElement): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null> {
  const detections = await detectFaces(imageElement);

  if (detections.length === 0) {
    return null;
  }

  // Get the largest/most confident face
  const primaryFace = detections.reduce((prev, current) => {
    const prevArea = prev.detection.box.width * prev.detection.box.height;
    const currentArea = current.detection.box.width * current.detection.box.height;
    return currentArea > prevArea ? current : prev;
  });

  const box = primaryFace.detection.box;

  // Add padding around face (20% on each side)
  const padding = 0.2;
  const paddedWidth = box.width * (1 + padding * 2);
  const paddedHeight = box.height * (1 + padding * 2);
  const paddedX = Math.max(0, box.x - box.width * padding);
  const paddedY = Math.max(0, box.y - box.height * padding);

  return {
    x: paddedX,
    y: paddedY,
    width: paddedWidth,
    height: paddedHeight
  };
}
