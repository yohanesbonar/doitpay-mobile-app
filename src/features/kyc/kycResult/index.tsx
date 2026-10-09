import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BadgeCheck, Check, Clock, Hourglass, TriangleAlert, X } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { KycRejection } from '@/features/kyc/api/kyc';
import { formatCountdown, useCountdown } from '@/hooks/useCountdown';
import { createStyles } from './styles';

export type KycResultVariant = 'VERIFIED' | 'REJECTED' | 'PENDING';

interface KycResultViewProps {
  variant: KycResultVariant;
  fullName?: string;
  rejection?: KycRejection;
  onClose: () => void;
  onContinueHome: () => void;
  onRetry: () => void;
  onContactSupport: () => void;
  // Called once when the cooldown runs out, so the screen can refetch the latest attempts.
  onCooldownEnd?: () => void;
}

const VARIANT_COPY: Record<KycResultVariant, { title: string; subtitle: string }> = {
  VERIFIED: {
    title: 'Verifikasi Berhasil',
    subtitle: 'Identitas kamu sudah terverifikasi. Sekarang kamu bisa melakukan transaksi di Doitpay.',
  },
  REJECTED: {
    title: 'Verifikasi Gagal',
    subtitle: 'Maaf, verifikasi identitas kamu belum berhasil. Perbaiki hal berikut lalu coba lagi.',
  },
  PENDING: {
    title: 'Verifikasi Sedang Ditinjau',
    subtitle: 'Data kamu sudah kami terima dan sedang ditinjau oleh tim kami.',
  },
};

const getInitials = (name?: string) =>
  name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('')
    : '?';

export const KycResultView = ({
  variant,
  fullName,
  rejection,
  onClose,
  onContinueHome,
  onRetry,
  onContactSupport,
  onCooldownEnd,
}: KycResultViewProps) => {
  const styles = createStyles();
  const isVerified = variant === 'VERIFIED';
  const isRejected = variant === 'REJECTED';
  const isPending = variant === 'PENDING';
  const copy = VARIANT_COPY[variant] ?? VARIANT_COPY.PENDING;
  const heroStyles = isVerified
    ? [styles.heroSuccess, styles.heroRingSuccess, styles.heroIconSuccess]
    : isRejected
      ? [styles.heroFailed, styles.heroRingFailed, styles.heroIconFailed]
      : [styles.heroPending, styles.heroRingPending, styles.heroIconPending];
  const hasAttempts = !!rejection && rejection.maxAttempt > 0;
  const isRetryLimitReached = hasAttempts && rejection.attempt >= rejection.maxAttempt;
  const cooldownRemaining = useCountdown(isRetryLimitReached ? rejection?.cooldown : null);
  const isCoolingDown = cooldownRemaining !== null && cooldownRemaining > 0;
  // Out of attempts: retry unlocks when the cooldown passes. Without a cooldown from BE there is
  // no known unlock time, so it stays locked.
  const isRetryLocked = isRetryLimitReached && (cooldownRemaining === null || isCoolingDown);

  const wasCoolingDown = useRef(false);
  useEffect(() => {
    if (wasCoolingDown.current && cooldownRemaining === 0) onCooldownEnd?.();
    wasCoolingDown.current = isCoolingDown;
  }, [cooldownRemaining, isCoolingDown, onCooldownEnd]);

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Verifikasi Identitas"
        titlePosition="center"
        titleStyle="medium"
        backgroundColor="#FFF"
        withCloseButton
        onPressRightButton={onClose}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, heroStyles[0]]}>
          <View style={[styles.heroRing, heroStyles[1]]} />
          <View style={[styles.heroIcon, heroStyles[2]]}>
            {isVerified ? (
              <Check size={32} color="#FFFFFF" strokeWidth={3.5} />
            ) : isRejected ? (
              <X size={32} color="#FFFFFF" strokeWidth={3.5} />
            ) : (
              <Hourglass size={28} color="#FFFFFF" strokeWidth={2.5} />
            )}
          </View>
        </View>

        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>

        {isVerified ? (
          <View style={[styles.card, styles.cardSuccess]}>
            <View style={styles.ownerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Pemilik Akun</Text>
                <Text style={styles.ownerName} numberOfLines={1}>
                  {fullName || '-'}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <BadgeCheck size={14} color="#17A86B" />
                <Text style={styles.verifiedText}>Terverifikasi</Text>
              </View>
            </View>
          </View>
        ) : isPending ? (
          <View style={[styles.card, styles.cardPending]}>
            <Text style={styles.pendingCardTitle}>Proses Verifikasi</Text>
            <Text style={styles.pendingCardText}>
              Proses ini biasanya memerlukan waktu hingga 1x24 jam. Kamu akan menerima notifikasi
              begitu proses verifikasi selesai.
            </Text>
          </View>
        ) : (
          <View style={styles.reasonCard}>
            <View style={styles.reasonLabelRow}>
              <TriangleAlert size={14} color="#E23D3D" />
              <Text style={styles.reasonLabel}>Alasan Penolakan</Text>
            </View>
              <Text style={styles.reasonText}>
                {rejection?.reason || 'Data verifikasi belum dapat kami setujui.'}
              </Text>
          </View>
        )}

        {isRejected && hasAttempts && (
          <View style={styles.attemptRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.attemptText}>
              Percobaan {rejection.attempt} dari {rejection.maxAttempt}
            </Text>
          </View>
        )}
        {isRetryLocked &&
          (isCoolingDown ? (
            <View style={styles.cooldownBox}>
              <Text style={styles.attemptLimitText}>
                Batas percobaan tercapai. Kamu bisa mencoba lagi dalam
              </Text>
              <Text style={styles.cooldownTimer}>{formatCountdown(cooldownRemaining ?? 0)}</Text>
            </View>
          ) : (
            <Text style={styles.attemptLimitText}>
              Batas percobaan verifikasi sudah tercapai. Silakan hubungi tim bantuan.
            </Text>
          ))}
      </ScrollView>

      <View style={styles.footer}>
        {isVerified ? (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onContinueHome}
            activeOpacity={0.85}>
            <Text style={styles.buttonPrimaryText}>Lanjut ke Home</Text>
          </TouchableOpacity>
        ) : isPending ? (
          <TouchableOpacity style={styles.buttonPrimary} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonPrimaryText}>Kembali</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.buttonPrimary, isRetryLocked && styles.buttonDisabled]}
              onPress={onRetry}
              disabled={isRetryLocked}
              activeOpacity={0.85}>
              <Text style={styles.buttonPrimaryText}>Ulangi Verifikasi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={onContactSupport}
              activeOpacity={0.85}>
              <Text style={styles.buttonSecondaryText}>Hubungi Bantuan</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default KycResultView;
