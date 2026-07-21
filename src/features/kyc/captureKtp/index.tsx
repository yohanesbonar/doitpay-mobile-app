import React, { useMemo, useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View, type LayoutRectangle } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { Contact } from 'lucide-react-native';
import ImageEditor from '@react-native-community/image-editor';
import { createStyles } from './styles';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
  type CameraRef,
} from 'react-native-vision-camera';

interface CaptureKtpViewProps {
  onPressBack: () => void;
  onSubmitCapturedKtp?: (uri: string) => void;
}

const CAMERA_PERMISSION_MESSAGE = 'Aplikasi membutuhkan izin kamera untuk mengambil foto KTP.';

export const CaptureKtpView = ({ onPressBack, onSubmitCapturedKtp }: CaptureKtpViewProps) => {
  const styles = createStyles();
  const cameraRef = useRef<CameraRef>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);
  const [frameLayout, setFrameLayout] = useState<LayoutRectangle | null>(null);
  const [guidanceFrameLayout, setGuidanceFrameLayout] = useState<LayoutRectangle | null>(null);
  const device = useCameraDevice('back');
  const photoOutput = usePhotoOutput();
  const { hasPermission, requestPermission } = useCameraPermission();

  const hasPreview = useMemo(() => !!capturedUri, [capturedUri]);

  const requestCameraPermission = async () => {
    setIsPermissionLoading(true);

    try {
      return await requestPermission();
    } finally {
      setIsPermissionLoading(false);
    }
  };

  const getImageSize = (uri: string) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        (error) => reject(error),
      );
    });

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const cropToGuidanceFrame = async (uri: string) => {
    if (!frameLayout || !guidanceFrameLayout) {
      return uri;
    }

    const { width: sourceWidth, height: sourceHeight } = await getImageSize(uri);
    const { width: frameWidth, height: frameHeight } = frameLayout;

    if (!sourceWidth || !sourceHeight || !frameWidth || !frameHeight) {
      return uri;
    }

    const scale = Math.max(frameWidth / sourceWidth, frameHeight / sourceHeight);
    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;
    const offsetX = (frameWidth - renderedWidth) / 2;
    const offsetY = (frameHeight - renderedHeight) / 2;

    const cropX = clamp((guidanceFrameLayout.x - offsetX) / scale, 0, sourceWidth);
    const cropY = clamp((guidanceFrameLayout.y - offsetY) / scale, 0, sourceHeight);
    const maxCropWidth = Math.max(0, sourceWidth - cropX);
    const maxCropHeight = Math.max(0, sourceHeight - cropY);
    const cropWidth = clamp(guidanceFrameLayout.width / scale, 1, maxCropWidth);
    const cropHeight = clamp(guidanceFrameLayout.height / scale, 1, maxCropHeight);

    const cropResult = await ImageEditor.cropImage(uri, {
      offset: {
        x: Math.round(cropX),
        y: Math.round(cropY),
      },
      size: {
        width: Math.round(cropWidth),
        height: Math.round(cropHeight),
      },
      quality: 1,
      format: 'jpeg',
    });

    return cropResult.uri;
  };

  const handleCapture = async () => {
    console.log('CaptureKtpView - handleCapture called');
    if (isCapturing) return;

    try {
      if (!device) {
        Alert.alert('Error', 'Kamera belakang belum tersedia di perangkat ini.');
        return;
      }

      const granted = hasPermission ? true : await requestCameraPermission();
      if (!granted) {
        Alert.alert('Izin Ditolak', CAMERA_PERMISSION_MESSAGE);
        return;
      }

      setIsCapturing(true);

      const photo = await photoOutput.capturePhotoToFile({ flashMode: 'off' }, {});
      const uri = photo?.filePath ? `file://${photo.filePath}` : null;

      if (!uri) {
        Alert.alert('Error', 'Foto tidak ditemukan setelah capture.');
        return;
      }

      const previewUri = await cropToGuidanceFrame(uri);
      setCapturedUri(previewUri);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengambil foto KTP';
      console.error('CaptureKtpView - handleCapture error:', error);

      if (message.includes('Camera is closed') || message.includes('abortRequests')) {
        console.warn('Capture ditunda/dibatalkan karena session kamera tertutup.');
        return;
      }

      Alert.alert('Error', message);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
  };

  const handleSubmit = () => {
    if (!capturedUri) {
      return;
    }

    if (onSubmitCapturedKtp) {
      onSubmitCapturedKtp(capturedUri);
      return;
    }

    Alert.alert('Sukses', 'Foto KTP siap diproses.');
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="KTP"
        backgroundColor="#FFF"
        titlePosition="center"
        titleStyle="medium"
        onPressBack={onPressBack}
        onPressRightButton={onPressBack}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Posisikan KTP di bingkai</Text>
        <Text style={styles.subtitle}>Pastikan foto jelas dan tidak terpotong</Text>

        {hasPreview ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedUri! }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.frameWrap}>
            <View
              style={styles.frame}
              onLayout={(event) => {
                setFrameLayout(event.nativeEvent.layout);
              }}>
              {device && hasPermission ? (
                <Camera
                  ref={cameraRef}
                  style={styles.cameraPreview}
                  device={device}
                  outputs={[photoOutput]}
                  isActive
                />
              ) : (
                <View style={styles.framePlaceholder}>
                  {!hasPermission && (
                    <TouchableOpacity
                      style={styles.permissionButton}
                      onPress={() => void requestCameraPermission()}
                      activeOpacity={0.85}>
                      <Text style={styles.permissionButtonText}>Izinkan Kamera</Text>
                    </TouchableOpacity>
                  )}
                  {isPermissionLoading && (
                    <Text style={styles.permissionHint}>Meminta izin kamera...</Text>
                  )}
                </View>
              )}

              {hasPermission && device && (
                <View pointerEvents="none" style={styles.guidanceOverlay}>
                  <View
                    style={styles.guidanceFrame}
                    onLayout={(event) => {
                      setGuidanceFrameLayout(event.nativeEvent.layout);
                    }}>
                    <View style={styles.guidanceInnerRow}>
                      <View style={styles.guidanceInnerLeftBox} />
                      <View style={styles.guidanceInnerRightBox} />
                    </View>
                  </View>

                  <View style={styles.guidanceInfo}>
                    <View style={styles.guidanceInfoIconBox}>
                      <Contact size={24} color="#FFFFFF" strokeWidth={2.2} />
                      <View style={styles.guidanceInfoIconLine}>
                        <View style={styles.guidanceInfoIconLineStrip} />
                        <View style={[styles.guidanceInfoIconLineStrip, { marginTop: 10 }]} />
                      </View>
                    </View>
                    <Text style={styles.guidanceInfoTitle}>Tampak depan KTP</Text>
                    <Text style={styles.guidanceInfoSubtitle}>
                      Pastikan informasi kartu KTP masuk dalam area kotak putih
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {hasPreview ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.buttonSecondaryFooter}
            onPress={handleRetake}
            activeOpacity={0.85}>
            <Text style={styles.buttonSecondaryText}>Retake Foto KTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleSubmit}
            activeOpacity={0.85}>
            <Text style={styles.buttonText}>Submit Foto KTP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleCapture}
            activeOpacity={0.85}
            disabled={isCapturing || !device}>
            <Text style={styles.buttonText}>
              {isCapturing ? 'Mengambil Foto...' : 'Ambil Foto KTP'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CaptureKtpView;
