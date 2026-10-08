import { Image } from 'react-native';
import ImageEditor from '@react-native-community/image-editor';

// BE requirement for ktpImage / selfieImage. Bounds are long side x short side, so they apply to
// both landscape (KTP) and portrait (selfie) photos.
export const KYC_IMAGE_MIN = { long: 640, short: 480 };
export const KYC_IMAGE_MAX = { long: 4000, short: 3000 };
export const KYC_IMAGE_MAX_BYTES = 1024 * 1024;

// Camera captures ~12MP, which rarely fits in 1MB. Start well below the max so the quality loop
// usually succeeds on the first or second pass.
const TARGET_LONG_SIDE = 1920;
const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55];
const DOWNSCALE_STEP = 0.8;

export class KycImageError extends Error {}

const getImageSize = (uri: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });

const fitsWithin = (width: number, height: number, bound: { long: number; short: number }) =>
  Math.max(width, height) <= bound.long && Math.min(width, height) <= bound.short;

const meetsMinimum = (width: number, height: number) =>
  Math.max(width, height) >= KYC_IMAGE_MIN.long && Math.min(width, height) >= KYC_IMAGE_MIN.short;

/**
 * Resizes and re-encodes a captured photo as JPEG so it satisfies the KYC upload limits
 * (640x480 to 4000x3000, at most 1MB). Throws KycImageError when the source is too small to use,
 * since upscaling would only pass the check without adding detail.
 */
export const prepareKycImage = async (uri: string): Promise<string> => {
  const source = await getImageSize(uri);

  if (!meetsMinimum(source.width, source.height)) {
    throw new KycImageError(
      `Resolusi foto terlalu kecil (minimal ${KYC_IMAGE_MIN.long}x${KYC_IMAGE_MIN.short}). Silakan ambil ulang.`,
    );
  }

  const longSide = Math.max(source.width, source.height);
  let scale = Math.min(1, TARGET_LONG_SIDE / longSide);

  while (true) {
    const width = Math.round(source.width * scale);
    const height = Math.round(source.height * scale);

    if (!meetsMinimum(width, height)) break;

    for (const quality of QUALITY_STEPS) {
      const result = await ImageEditor.cropImage(uri, {
        offset: { x: 0, y: 0 },
        size: { width: source.width, height: source.height },
        displaySize: { width, height },
        resizeMode: 'stretch',
        quality,
        format: 'jpeg',
      });

      if (result.size <= KYC_IMAGE_MAX_BYTES && fitsWithin(result.width, result.height, KYC_IMAGE_MAX)) {
        return result.uri;
      }
    }

    scale *= DOWNSCALE_STEP;
  }

  throw new KycImageError('Ukuran foto terlalu besar. Silakan ambil ulang.');
};
