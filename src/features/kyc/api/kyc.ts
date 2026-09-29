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
