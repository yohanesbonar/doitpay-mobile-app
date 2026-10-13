import { KycRejectionReason } from '@/features/kyc/api/kyc';

// User-facing copy per back-office rejection code (from the KYC result states spec).
const REASON_COPY: Record<string, { text: string; hint: string }> = {
  KTP_BLUR: {
    text: 'Foto KTP buram atau tidak terbaca',
    hint: 'Pastikan seluruh teks pada KTP terlihat jelas dan tidak ada pantulan cahaya saat mengambil foto.',
  },
  KTP_CROPPED: {
    text: 'Foto KTP terpotong',
    hint: 'Pastikan seluruh bagian KTP masuk ke dalam bingkai foto.',
  },
  DATA_MISMATCH: {
    text: 'Data tidak sesuai dengan KTP',
    hint: 'Pastikan nama, NIK, tanggal lahir, dan alamat diisi persis seperti yang tertera di KTP.',
  },
  FACE_MISMATCH: {
    text: 'Selfie tidak cocok dengan foto KTP',
    hint: 'Ambil selfie dengan wajah terlihat jelas, tanpa masker atau kacamata hitam.',
  },
  KTP_EXPIRED: {
    text: 'KTP kedaluwarsa atau tidak berlaku',
    hint: 'Gunakan KTP asli yang masih berlaku.',
  },
  POOR_LIGHTING: {
    text: 'Pencahayaan kurang',
    hint: 'Ambil foto di tempat yang terang dan hindari bayangan.',
  },
  SUSPECTED_FRAUD: {
    text: 'Dokumen tidak valid',
    hint: 'Silakan hubungi tim bantuan Doitpay untuk proses verifikasi manual.',
  },
};

const FALLBACK_TEXT = 'Data verifikasi belum dapat kami setujui';

export const getReasonCopy = (reason: KycRejectionReason) => {
  const copy = reason.code ? REASON_COPY[reason.code] : undefined;
  return {
    // Prefer our localized copy for known codes; otherwise show what BE sent.
    text: copy?.text ?? reason.message ?? FALLBACK_TEXT,
    hint: copy?.hint,
  };
};
