import {
  supabase,
  uploadImage,
  getImageUrl,
  deleteImage,
  STORAGE_BUCKET,
} from './supabase';

// Image configuration
export const IMAGE_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],
  formats: {
    hero: { width: 1200, height: 630, quality: 85 },
    thumbnail: { width: 400, height: 200, quality: 80 },
    avatar: { width: 200, height: 200, quality: 85 },
  },
} as const;

// Generate unique image path
export function generateImagePath(
  filename: string,
  folder = 'uploads'
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '-');

  return `${folder}/${timestamp}-${randomId}-${cleanName}`;
}

// Validate image file
export function validateImage(file: File): {
  isValid: boolean;
  error?: string;
} {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (file.size > IMAGE_CONFIG.maxSize) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${IMAGE_CONFIG.maxSize / 1024 / 1024}MB`,
    };
  }

  if (
    !IMAGE_CONFIG.allowedTypes.includes(
      file.type as (typeof IMAGE_CONFIG.allowedTypes)[number]
    )
  ) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${IMAGE_CONFIG.allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
}

// Upload blog hero image
export async function uploadHeroImage(file: File): Promise<{
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}> {
  const validation = validateImage(file);
  if (!validation.isValid) {
    return { success: false, error: validation.error || 'Validation failed' };
  }

  try {
    const imagePath = generateImagePath(file.name, 'hero-images');
    const uploadResult = await uploadImage(file, imagePath);

    if (uploadResult) {
      const publicUrl = getImageUrl(imagePath);
      return {
        success: true,
        url: publicUrl,
        path: imagePath,
      };
    }

    return { success: false, error: 'Upload failed' };
  } catch (error) {
    console.error('Error uploading hero image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Upload general blog image
export async function uploadBlogImage(file: File): Promise<{
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}> {
  const validation = validateImage(file);
  if (!validation.isValid) {
    return { success: false, error: validation.error || 'Validation failed' };
  }

  try {
    const imagePath = generateImagePath(file.name, 'blog-images');
    const uploadResult = await uploadImage(file, imagePath);

    if (uploadResult) {
      const publicUrl = getImageUrl(imagePath);
      return {
        success: true,
        url: publicUrl,
        path: imagePath,
      };
    }

    return { success: false, error: 'Upload failed' };
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get optimized image URL with transformations
export function getOptimizedImageUrl(
  path: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}
): string {
  const baseUrl = getImageUrl(path);

  // If no optimization options, return original
  if (
    !options.width &&
    !options.height &&
    !options.quality &&
    !options.format
  ) {
    return baseUrl;
  }

  // Build transformation parameters
  const params = new URLSearchParams();

  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  return `${baseUrl}?${params.toString()}`;
}

// Delete image and clean up
export async function deleteImageFile(path: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await deleteImage(path);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Generate responsive image set
export function generateResponsiveImageSet(path: string): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  const baseUrl = getImageUrl(path);

  const srcSet = [
    `${getOptimizedImageUrl(path, { width: 400, quality: 80 })} 400w`,
    `${getOptimizedImageUrl(path, { width: 800, quality: 85 })} 800w`,
    `${getOptimizedImageUrl(path, { width: 1200, quality: 85 })} 1200w`,
    `${getOptimizedImageUrl(path, { width: 1600, quality: 80 })} 1600w`,
  ].join(', ');

  const sizes = [
    '(max-width: 400px) 400px',
    '(max-width: 800px) 800px',
    '(max-width: 1200px) 1200px',
    '1600px',
  ].join(', ');

  return {
    src: baseUrl,
    srcSet,
    sizes,
  };
}

// Check if image exists in storage
export async function imageExists(path: string): Promise<boolean> {
  try {
    const filename = path.split('/').pop();
    if (!filename) return false;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        search: filename,
      });

    return !error && data && data.length > 0;
  } catch (error) {
    console.error('Error checking image existence:', error);
    return false;
  }
}

// Get image metadata
export async function getImageMetadata(path: string): Promise<{
  size?: number;
  lastModified?: string;
  contentType?: string;
} | null> {
  try {
    const filename = path.split('/').pop();
    if (!filename) return null;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        search: filename,
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    const file = data[0];
    if (!file) return null;

    return {
      size: file.metadata?.size,
      lastModified: file.updated_at,
      contentType: file.metadata?.mimetype,
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return null;
  }
}
