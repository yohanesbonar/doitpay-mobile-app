import React, { useMemo, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { Check } from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { createStyles } from './styles';

interface CaptureSelfieViewProps {
  onPressBack: () => void;
  onSubmitCapturedSelfie?: (uri: string) => void;
}

const checklistItems = ['Tanpa Masker', 'Kacamata Hitam', 'Cahaya Cukup'];

export const CaptureSelfieView = ({
  onPressBack,
  onSubmitCapturedSelfie,
}: CaptureSelfieViewProps) => {
  const styles = createStyles();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);
  const device = useCameraDevice('front');
  const photoOutput = usePhotoOutput();
  const { hasPermission, requestPermission } = useCameraPermission();
  const hasPreview = useMemo(() => !!capturedUri, [capturedUri]);

  const requestCameraAccess = async () => {
    setIsPermissionLoading(true);
    try {
      await requestPermission();
    } finally {
      setIsPermissionLoading(false);
    }
  };

  const handleCapture = async () => {
    if (isCapturing) return;

    try {
      if (!device) {
        Alert.alert('Error', 'Kamera depan belum tersedia di perangkat ini.');
        return;
      }

      const granted = hasPermission ? true : await requestPermission();
      if (!granted) {
        Alert.alert(
          'Izin Ditolak',
          'Aplikasi membutuhkan izin kamera untuk mengambil foto selfie.',
        );
        return;
      }

      setIsCapturing(true);

      const photo = await photoOutput.capturePhotoToFile({ flashMode: 'off' }, {});
      const uri = photo?.filePath ? `file://${photo.filePath}` : null;

      if (!uri) {
        Alert.alert('Error', 'Foto tidak ditemukan setelah capture.');
        return;
      }

      setCapturedUri(uri);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengambil foto selfie';
      if (message.includes('Camera is closed') || message.includes('abortRequests')) {
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

    if (onSubmitCapturedSelfie) {
      onSubmitCapturedSelfie(capturedUri);
      return;
    }

    Alert.alert('Sukses', 'Foto selfie siap diproses.');
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Foto Selfie"
        titlePosition="center"
        titleStyle="medium"
        backgroundColor="#FFF"
        onPressBack={onPressBack}
        onPressRightButton={onPressBack}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Ambil foto wajah kamu</Text>
        <Text style={styles.subtitle}>Untuk verifikasi liveness</Text>

        {hasPreview ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedUri! }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.guideArea}>
            <View style={styles.guideCircle}>
              {device && hasPermission ? (
                <Camera
                  style={styles.cameraPreview}
                  device={device}
                  outputs={[photoOutput]}
                  isActive
                />
              ) : (
                <View style={styles.cameraFallback}>
                  {!hasPermission && (
                    <TouchableOpacity
                      style={styles.permissionButton}
                      onPress={() => void requestCameraAccess()}
                      activeOpacity={0.85}>
                      <Text style={styles.permissionButtonText}>Izinkan Kamera</Text>
                    </TouchableOpacity>
                  )}
                  {isPermissionLoading && (
                    <Text style={styles.permissionHint}>Meminta izin kamera...</Text>
                  )}
                </View>
              )}

              <View pointerEvents="none" style={styles.guideOverlay}>
                <Svg viewBox="0 0 320 320" style={styles.guideSvg}>
                  <Circle
                    cx={160}
                    cy={120}
                    r={46}
                    stroke="#111827"
                    strokeWidth={2.4}
                    strokeDasharray="12 14"
                    fill="none"
                  />
                  <Path
                    d="M60 250 C90 206, 130 194, 160 194 C190 194, 230 206, 260 250"
                    stroke="#111827"
                    strokeWidth={2.4}
                    strokeDasharray="14 14"
                    fill="none"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
            </View>

            <View style={styles.checklistWrap}>
              {checklistItems.map((item) => (
                <View key={item} style={styles.checklistPill}>
                  <Check size={16} color="#111827" strokeWidth={2.4} />
                  <Text style={styles.checklistText}>{item}</Text>
                </View>
              ))}
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
            <Text style={styles.buttonSecondaryText}>Retake Foto Selfie</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleSubmit}
            activeOpacity={0.85}>
            <Text style={styles.buttonText}>Submit Foto Selfie</Text>
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
              {isCapturing ? 'Mengambil Foto...' : 'Ambil Foto Selfie'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CaptureSelfieView;
