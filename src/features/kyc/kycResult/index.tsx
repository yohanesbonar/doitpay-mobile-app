import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BadgeCheck, Check, TriangleAlert, X } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { KycRejectionReason } from '@/features/kyc/api/kyc';
import { getReasonCopy } from './reasons';
import { createStyles } from './styles';

export type KycResultVariant = 'VERIFIED' | 'REJECTED';

interface KycResultViewProps {
  variant: KycResultVariant;
  fullName?: string;
  reasons?: KycRejectionReason[];
  isLoadingReasons?: boolean;
  onClose: () => void;
  onContinueHome: () => void;
  onRetry: () => void;
  onContactSupport: () => void;
}

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
  reasons = [],
  isLoadingReasons = false,
  onClose,
  onContinueHome,
  onRetry,
  onContactSupport,
}: KycResultViewProps) => {
  const styles = createStyles();
  const isVerified = variant === 'VERIFIED';
  const shownReasons = reasons.length > 0 ? reasons : [{}];

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
        <View style={[styles.hero, isVerified ? styles.heroSuccess : styles.heroFailed]}>
          <View
            style={[styles.heroRing, isVerified ? styles.heroRingSuccess : styles.heroRingFailed]}
          />
          <View
            style={[styles.heroIcon, isVerified ? styles.heroIconSuccess : styles.heroIconFailed]}>
            {isVerified ? (
              <Check size={32} color="#FFFFFF" strokeWidth={3.5} />
            ) : (
              <X size={32} color="#FFFFFF" strokeWidth={3.5} />
            )}
          </View>
        </View>

        <Text style={styles.title}>{isVerified ? 'Verifikasi Berhasil' : 'Verifikasi Gagal'}</Text>
        <Text style={styles.subtitle}>
          {isVerified
            ? 'Identitas kamu sudah terverifikasi. Sekarang kamu bisa melakukan transaksi di Doitpay.'
            : 'Maaf, verifikasi identitas kamu belum berhasil. Perbaiki hal berikut lalu coba lagi.'}
        </Text>

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
        ) : (
          <View style={styles.reasonCard}>
            <View style={styles.reasonLabelRow}>
              <TriangleAlert size={14} color="#E23D3D" />
              <Text style={styles.reasonLabel}>Alasan Penolakan</Text>
            </View>
            {isLoadingReasons ? (
              <ActivityIndicator color="#E23D3D" />
            ) : (
              shownReasons.map((reason, index) => {
              const copy = getReasonCopy(reason);
              const isLast = index === shownReasons.length - 1;
              return (
                <View
                  key={`${reason.code ?? reason.message ?? 'reason'}-${index}`}
                  style={[styles.reasonItem, isLast && styles.reasonItemLast]}>
                  <Text style={styles.reasonText}>{copy.text}</Text>
                  {copy.hint ? <Text style={styles.reasonHint}>{copy.hint}</Text> : null}
                </View>
              );
              })
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {isVerified ? (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onContinueHome}
            activeOpacity={0.85}>
            <Text style={styles.buttonPrimaryText}>Lanjut ke Home</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.buttonPrimary} onPress={onRetry} activeOpacity={0.85}>
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
