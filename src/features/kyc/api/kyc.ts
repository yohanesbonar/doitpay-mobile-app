import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';

// 'M' verified against BE (MALE/male/L are rejected). 'F' assumed by symmetry, confirm with BE.
export type KycGender = 'M' | 'F';

export interface SubmitKycPayload {
  fullName: string;
  nik: string;
  // YYYY-MM-DD
  birthDate: string;
  gender: KycGender;
  addressLine: string;
  ktpImageUri: string;
  selfieImageUri: string;
}

const toImagePart = (uri: string, name: string) => ({
  uri,
  name,
  type: 'image/jpeg',
});

export const kycApi = {
  submit: async ({
    ktpImageUri,
    selfieImageUri,
    ...fields
  }: SubmitKycPayload): Promise<ResponseApi<unknown>> => {
    const formData = new FormData();
    formData.append('fullName', fields.fullName);
    formData.append('nik', fields.nik);
    formData.append('birthDate', fields.birthDate);
    formData.append('gender', fields.gender);
    formData.append('addressLine', fields.addressLine);
    // RN FormData accepts { uri, name, type } for files; the DOM typings don't know about it.
    formData.append('ktpImage', toImagePart(ktpImageUri, 'ktp.jpg') as any);
    formData.append('selfieImage', toImagePart(selfieImageUri, 'selfie.jpg') as any);

    const { data } = await apiClient.post<ResponseApi<unknown>>('/v1/kyc/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

// ---- KYC status ----

export type KycReviewStatus = 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KycRejectionReason {
  code?: string;
  message?: string;
}

export interface KycStatusResult {
  status: KycReviewStatus | string;
  reasons: KycRejectionReason[];
}

const toReason = (value: unknown): KycRejectionReason | null => {
  if (!value) return null;
  if (typeof value === 'string') {
    // Codes come as UPPER_SNAKE (e.g. KTP_BLUR); anything else is free text from BE.
    return /^[A-Z0-9_]+$/.test(value) ? { code: value } : { message: value };
  }
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    const code = (v.code ?? v.reasonCode ?? v.reason_code) as string | undefined;
    const message = (v.message ?? v.description ?? v.reason ?? v.label) as string | undefined;
    return code || message ? { code, message } : null;
  }
  return null;
};

// TODO: response shape of GET /v1/kyc/status is not confirmed yet (no account to call it with).
// Everything shape-specific is isolated here; tighten it once a real response is seen.
export const normalizeKycStatus = (data: Record<string, any> | undefined): KycStatusResult => {
  const status = String(data?.status ?? data?.kycStatus ?? 'NOT_SUBMITTED').toUpperCase();
  const rawReasons =
    data?.reasons ??
    data?.rejectionReasons ??
    data?.rejectionReason ??
    data?.rejection_reason ??
    data?.reasonCode ??
    data?.reason_code ??
    data?.reason;
  const reasons = (Array.isArray(rawReasons) ? rawReasons : [rawReasons])
    .map(toReason)
    .filter((r): r is KycRejectionReason => r !== null);

  return { status, reasons };
};

export const kycStatusApi = {
  getStatus: async (): Promise<KycStatusResult> => {
    const { data } = await apiClient.get<ResponseApi<Record<string, any>>>('/v1/kyc/status');
    if (__DEV__) console.log('[KYC] /v1/kyc/status raw response:', JSON.stringify(data));
    return normalizeKycStatus(data?.data);
  },
};
