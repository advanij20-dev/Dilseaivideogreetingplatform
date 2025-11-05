import { getFaceBoundingBox } from './faceDetection';

export interface ImageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProcessedImage {
  file: File;
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Validate image quality and properties
 */
export async function validateImage(file: File): Promise<ImageValidation> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
    return { isValid: false, errors, warnings };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('Image size must be less than 10MB');
  }

  // Check minimum file size (at least 50KB for quality)
  const minSize = 50 * 1024; // 50KB
  if (file.size < minSize) {
    warnings.push('Image quality may be low. Consider using a higher quality photo.');
  }

  // Load image to check dimensions
  const img = await loadImage(file);

  // Check minimum dimensions (at least 720x1280 for 9:16)
  const minWidth = 720;
  const minHeight = 1280;

  if (img.width < minWidth || img.height < minHeight) {
    errors.push(`Image must be at least ${minWidth}x${minHeight} pixels`);
  }

  // Warn if aspect ratio is far from 9:16
  const aspectRatio = img.width / img.height;
  const targetRatio = 9 / 16;
  const ratioDiff = Math.abs(aspectRatio - targetRatio);

  if (ratioDiff > 0.3) {
    warnings.push('Image will be cropped to 9:16 aspect ratio for WhatsApp Status');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Load image from file
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Auto-crop image to 9:16 aspect ratio
 * Tries to center on detected face if available
 */
export async function cropToAspectRatio(
  file: File,
  targetRatio: number = 9 / 16
): Promise<ProcessedImage> {
  const img = await loadImage(file);
  const currentRatio = img.width / img.height;

  // If already correct aspect ratio (within 2% tolerance), return as-is
  if (Math.abs(currentRatio - targetRatio) < 0.02) {
    return {
      file,
      url: URL.createObjectURL(file),
      width: img.width,
      height: img.height,
      aspectRatio: currentRatio
    };
  }

  // Create canvas for cropping
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  let cropX = 0;
  let cropY = 0;
  let cropWidth = img.width;
  let cropHeight = img.height;

  // Calculate crop dimensions to achieve target ratio
  if (currentRatio > targetRatio) {
    // Image is wider than target - crop width
    cropWidth = img.height * targetRatio;
    cropX = (img.width - cropWidth) / 2;
  } else {
    // Image is taller than target - crop height
    cropHeight = img.width / targetRatio;
    cropY = (img.height - cropHeight) / 2;
  }

  // Try to center crop on face
  try {
    const faceBounds = await getFaceBoundingBox(img);
    if (faceBounds) {
      // Calculate face center
      const faceCenterX = faceBounds.x + faceBounds.width / 2;
      const faceCenterY = faceBounds.y + faceBounds.height / 2;

      // Adjust crop to center on face while staying within bounds
      if (currentRatio > targetRatio) {
        // Cropping width - center horizontally on face
        cropX = Math.max(0, Math.min(img.width - cropWidth, faceCenterX - cropWidth / 2));
      } else {
        // Cropping height - center vertically on face
        cropY = Math.max(0, Math.min(img.height - cropHeight, faceCenterY - cropHeight / 2));
      }
    }
  } catch (error) {
    console.log('Face detection failed, using center crop:', error);
    // Fall back to center crop (already calculated above)
  }

  // Set canvas size to cropped dimensions
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // Draw cropped image
  ctx.drawImage(
    img,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      file.type,
      0.95 // High quality
    );
  });

  // Create new file from blob
  const croppedFile = new File(
    [blob],
    file.name.replace(/\.(jpg|jpeg|png|webp)$/i, '-cropped.$1'),
    { type: file.type }
  );

  return {
    file: croppedFile,
    url: URL.createObjectURL(croppedFile),
    width: cropWidth,
    height: cropHeight,
    aspectRatio: cropWidth / cropHeight
  };
}

/**
 * Resize image if too large while maintaining aspect ratio
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1080,
  maxHeight: number = 1920
): Promise<File> {
  const img = await loadImage(file);

  // If image is smaller than max dimensions, return as-is
  if (img.width <= maxWidth && img.height <= maxHeight) {
    return file;
  }

  // Calculate new dimensions maintaining aspect ratio
  let newWidth = img.width;
  let newHeight = img.height;

  if (img.width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (img.height * maxWidth) / img.width;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (img.width * maxHeight) / img.height;
  }

  // Create canvas for resizing
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw resized image
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  // Convert to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      file.type,
      0.92
    );
  });

  return new File([blob], file.name, { type: file.type });
}

/**
 * Process uploaded image: validate, resize, and auto-crop
 */
export async function processUploadedImage(file: File): Promise<{
  processedImage: ProcessedImage;
  validation: ImageValidation;
}> {
  // Validate image
  const validation = await validateImage(file);

  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Resize if needed
  const resizedFile = await resizeImage(file);

  // Auto-crop to 9:16
  const processedImage = await cropToAspectRatio(resizedFile);

  return {
    processedImage,
    validation
  };
}
