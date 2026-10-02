import { PaymentCalculateData } from './payment-calculate-api';

export interface ManualBankOption {
  id: string;
  code: string;
  name: string;
  shortName: string;
  logo: number | null;
}

export interface ManualBankTransferData {
  id: string;
  paymentId: string;
  status: 'CREATED';
  amount: number;
  createdAt: string;
  paymentExpiredAt: string;
  manualBank: {
    uniqueCode: number;
    totalAmount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: 'PENDING';
  };
}

export interface ManualBankTransferPayload {
  inquiryId: string;
  amount: number;
  transactionPurpose: string;
  payMethod: 'MANUAL_BANK';
  payChannel: string;
}

export interface ProofUploadUrlResponse {
  data: {
    uploadUrl: string;
    fileKey: string;
    expiresAt: string;
  };
}

export interface SubmitProofResponse {
  status: 'success';
  data: {
    status: 'VERIFYING';
    fileKey: string;
  };
}

const manualBanks: ManualBankOption[] = [
  {
    id: 'bca',
    code: 'BCA',
    name: 'Bank Central Asia',
    shortName: 'BCA',
    logo: require('../../../../assets/images/ic-BCA.png'),
  },
  {
    id: 'blu',
    code: 'NOBU',
    name: 'Blu BCA Digital',
    shortName: 'blu',
    logo: null,
  },
];

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

// Local stub until the manual-bank catalogue and calculation endpoints are available.
export const manualBankApiMock = {
  async getBanks(search = ''): Promise<ManualBankOption[]> {
    await wait(200);
    const normalizedSearch = search.trim().toLowerCase();
    return manualBanks.filter((bank) =>
      `${bank.name} ${bank.code}`.toLowerCase().includes(normalizedSearch),
    );
  },

  async calculate(amount: number): Promise<PaymentCalculateData & { uniqueCode: number }> {
    await wait(250);
    const uniqueCode = 123;

    // Temporary response matching the free-transfer calculation while the
    // backend's MANUAL_BANK calculation support is being prepared.
    return {
      amount,
      dailyLimitTotal: 3_000_000,
      dailyLimitUsed: 1_500_000,
      fee: 0,
      feePerTransaction: 6_500,
      freeQuotaRemaining: 5,
      freeQuotaTotal: 5,
      isFreeTransfer: true,
      uniqueCode,
      totalAmount: amount + uniqueCode,
    };
  },

  async createTransfer(input: {
    payload: ManualBankTransferPayload;
    bank: ManualBankOption;
    uniqueCode: number;
    totalAmount: number;
  }): Promise<{ status: 'success'; message: string; data: ManualBankTransferData }> {
    await wait(400);
    const createdAt = new Date();
    const paymentExpiredAt = new Date(createdAt.getTime() + 10 * 60 * 1000);
    const sequence = String(Date.now()).slice(-8);

    return {
      status: 'success',
      message: 'Transfer manual berhasil dibuat (mock)',
      data: {
        id: `mock-transfer-${Date.now()}`,
        paymentId: `mock-payment-${Date.now()}`,
        status: 'CREATED',
        amount: input.payload.amount,
        createdAt: createdAt.toISOString(),
        paymentExpiredAt: paymentExpiredAt.toISOString(),
        manualBank: {
          uniqueCode: input.uniqueCode,
          totalAmount: input.totalAmount,
          bankName: input.bank.name,
          accountNumber: `8880${sequence}`,
          accountName: 'PT Doitpay Indonesia',
          status: 'PENDING',
        },
      },
    };
  },

  async requestProofUploadUrl(
    transferId: string,
    fileName = 'proof.jpg',
  ): Promise<ProofUploadUrlResponse> {
    await wait(400);
    if (!transferId) throw new Error('Transfer ID is required');

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'proof.jpg';
    const fileKey = `proofs/${transferId}/${Date.now()}-${safeFileName}`;
    return {
      data: {
        // This is a response-shaped mock URL. No request is made to S3.
        uploadUrl: `https://doitpay-private.s3.ap-southeast-1.amazonaws.com/${fileKey}?mock-presigned=true`,
        fileKey,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      },
    };
  },

  async uploadProofToS3(uploadUrl: string, imageUri: string): Promise<void> {
    await wait(800);
    if (!uploadUrl || !imageUri) throw new Error('Upload URL and proof image are required');
    // Simulate a successful direct PUT to S3 without uploading the local file.
  },

  async confirmProofUpload(transferId: string, fileKey: string): Promise<SubmitProofResponse> {
    await wait(400);
    if (!transferId || !fileKey) throw new Error('Transfer ID and file key are required');
    // Simulate POST /v1/transfers/{id}/proof until the endpoint is available in staging.
    return { status: 'success', data: { status: 'VERIFYING', fileKey } };
  },

  async submitProof(
    transferId: string,
    imageUri: string,
    fileName?: string | null,
  ): Promise<SubmitProofResponse> {
    if (!transferId || !imageUri) throw new Error('Transfer ID and proof image are required');

    const { data } = await this.requestProofUploadUrl(transferId, fileName || 'proof.jpg');
    await this.uploadProofToS3(data.uploadUrl, imageUri);
    return this.confirmProofUpload(transferId, data.fileKey);
  },
};
