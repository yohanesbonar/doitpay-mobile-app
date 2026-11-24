import { Image } from 'react-native';
import ImageEditor from '@react-native-community/image-editor';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { CommonResolutions } from 'react-native-vision-camera';

// BE requirement for ktpImage / selfieImage. Bounds are long side x short side, so they apply to
// both landscape (KTP) and portrait (selfie) photos.
export const KYC_IMAGE_MIN = { long: 640, short: 480 };
export const KYC_IMAGE_MAX = { long: 4000, short: 3000 };
export const KYC_IMAGE_MAX_BYTES = 1024 * 1024;

// Cameras capture at KYC_CAMERA_OPTIONS (below), so a photo normally already fits and is used as is.
// Re-encoding is only a fallback for oversized files.
const FALLBACK_QUALITY_STEPS = [0.75, 0.6, 0.45];

// Shared by the KTP and selfie cameras. FHD 4:3 (1440x1920) is well inside the BE bounds and at
// this quality a JPEG is typically a few hundred KB. JPEG explicitly: 'native' is HEIC on most
// iPhones, and KYC submit sends image/jpeg.
export const KYC_CAMERA_OPTIONS = {
  containerFormat: 'jpeg',
  targetResolution: CommonResolutions.FHD_4_3,
  quality: 0.85,
} as const;

export class KycImageError extends Error {}

const getImageSize = (uri: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });

const getFileSize = async (uri: string) => {
  const stat = await ReactNativeBlobUtil.fs.stat(uri.replace('file://', ''));
  return Number(stat.size);
};

const fitsWithin = (width: number, height: number, bound: { long: number; short: number }) =>
  Math.max(width, height) <= bound.long && Math.min(width, height) <= bound.short;

const meetsMinimum = (width: number, height: number) =>
  Math.max(width, height) >= KYC_IMAGE_MIN.long && Math.min(width, height) >= KYC_IMAGE_MIN.short;

/**
 * Makes sure a captured photo satisfies the KYC upload limits (640x480 to 4000x3000, at most 1MB).
 *
 * Never resizes with ImageEditor's `displaySize`: on Android its cropAndResize path rounds the
 * crop rect after inSampleSize decoding and crashes ("y + height must be <= bitmap.height()")
 * when the photo height is not divisible by the sample size, which depends on the device camera.
 * Size is controlled at capture time instead (targetResolution + quality).
 */
export const prepareKycImage = async (uri: string): Promise<string> => {
  const { width, height } = await getImageSize(uri);

  if (!meetsMinimum(width, height)) {
    throw new KycImageError(
      `Resolusi foto terlalu kecil (minimal ${KYC_IMAGE_MIN.long}x${KYC_IMAGE_MIN.short}). Silakan ambil ulang.`,
    );
  }
  if (!fitsWithin(width, height, KYC_IMAGE_MAX)) {
    throw new KycImageError('Resolusi foto terlalu besar. Silakan ambil ulang.');
  }

  if ((await getFileSize(uri)) <= KYC_IMAGE_MAX_BYTES) {
    return uri;
  }

  // Oversized file: re-encode at lower JPEG quality, same dimensions (plain crop path, no resize).
  for (const quality of FALLBACK_QUALITY_STEPS) {
    try {
      const result = await ImageEditor.cropImage(uri, {
        offset: { x: 0, y: 0 },
        size: { width, height },
        quality,
        format: 'jpeg',
      });
      if (result.size <= KYC_IMAGE_MAX_BYTES) {
        return result.uri;
      }
    } catch (error) {
      console.error('prepareKycImage - re-encode failed:', error);
      break;
    }
  }

  throw new KycImageError('Ukuran foto terlalu besar. Silakan ambil ulang.');
};
