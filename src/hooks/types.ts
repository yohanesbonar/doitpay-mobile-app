
export type TransferApiStatus = 'DITERIMA' | 'VERIFIKASI' | 'MENGIRIM' | 'SUCCESS' | 'FAILED';

export interface StepConfig {
  label: string;
  badgeText: string;
  iconName: string; 
}

export const TRANSFER_STEPS: StepConfig[] = [
  { label: 'Diterima', badgeText: 'Transfer diterima', iconName: 'Inbox' },
  { label: 'Verifikasi', badgeText: 'Memverifikasi transfer', iconName: 'Scan' },
  { label: 'Mengirim', badgeText: 'Mengirim Dana', iconName: 'Send' },
  { label: 'Selesai', badgeText: 'Transfer Berhasil', iconName: 'CheckCircle' },
];

export const getActiveStepIndex = (status: TransferApiStatus | undefined): number => {
  switch (status) {
    case 'DITERIMA': return 0;
    case 'VERIFIKASI': return 1;
    case 'MENGIRIM': return 2;
    case 'SUCCESS': return 3;
    default: return 0; // Default fallback ke step awal jika pending
  }
};