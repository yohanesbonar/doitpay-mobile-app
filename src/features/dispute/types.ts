export type DisputeStatus =
  | 'DIAJUKAN'
  | 'DIPROSES'
  | 'DIBUTUHKAN_INFO'
  | 'SELESAI'
  | 'DITARIK'
  | 'DITOLAK';

export interface DisputeReport {
  id: string;
  transactionId: string;
  issueType: string;
  date: string;
  status: DisputeStatus;
  recipientName: string;
  amount: number;
  description?: string;
  attachmentCount?: number;
}

export const ISSUE_OPTIONS = [
  'Salah Transfer',
  'Dana belum diterima penerima',
  'Transfer gagal, saldo terpotong',
  'Duplikat Transaksi',
  'Transaksi tidak saya kenali',
  'Kendala biaya atau limit transaksi',
  'Lainnya',
];

export const ACTIVE_REPORTS: DisputeReport[] = [
  {
    id: 'LAPORAN-ID-21312',
    transactionId: 'TRX00123123',
    issueType: 'Salah Transfer',
    date: '30 Juni 2026',
    status: 'DIPROSES',
    recipientName: 'Joni Wahyu',
    amount: 1500000,
    description: 'Nominal yang saya transfer tidak sesuai tujuan.',
    attachmentCount: 1,
  },
  {
    id: 'LAPORAN-ID-21314',
    transactionId: 'TRX00123125',
    issueType: 'Transfer Gagal',
    date: '27 Mei 2026',
    status: 'DIBUTUHKAN_INFO',
    recipientName: 'N/A',
    amount: 0,
    description: 'Sistem meminta lampiran tambahan agar proses dilanjutkan.',
    attachmentCount: 0,
  },
  {
    id: 'LAPORAN-ID-21313',
    transactionId: 'TRX00123124',
    issueType: 'Biaya & Limit',
    date: '27 Juni 2026',
    status: 'DIAJUKAN',
    recipientName: 'Dinar Lint',
    amount: 950000,
    description: 'Saldo terpotong tapi tujuan belum menerima dana.',
    attachmentCount: 0,
  },
];

export const FINISHED_REPORTS: DisputeReport[] = [
  {
    id: 'LAPORAN-ID-21291',
    transactionId: 'TRX00122999',
    issueType: 'Debit Ganda',
    date: '18 Juni 2026',
    status: 'SELESAI',
    recipientName: 'N/A',
    amount: 780000,
    description: 'Investigasi selesai, transaksi berhasil dibatalkan.',
    attachmentCount: 2,
  },
  {
    id: 'LAPORAN-ID-21280',
    transactionId: 'TRX00122888',
    issueType: 'Transaksi Asing',
    date: '27 Mei 2026',
    status: 'DITOLAK',
    recipientName: 'N/A',
    amount: 0,
    description: 'Laporan ditolak karena tidak ditemukan anomali pada transaksi.',
    attachmentCount: 0,
  },
];
