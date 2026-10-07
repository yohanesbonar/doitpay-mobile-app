import apiClient from '@/api/client';
import type { ResponseApi } from '@/api/types';

export interface ProofUploadUrlResponse {
  data: {
    uploadUrl: string;
    fileKey: string;
    expiresAt: string;
    uploadFields: Record<string, string>;
  };
}

export interface ConfirmProofUploadPayload {
  fileKey: string;
}

export interface ConfirmProofUploadData {
  id: string;
}

export interface ConfirmProofUploadResponse {
  status: 'success';
  data: ConfirmProofUploadData;
  message: string;
}

export type ProofUploadErrorType = 'fileSize' | 'fileFormat' | 'serverError';

export class ProofUploadError extends Error {
  constructor(
    public readonly type: ProofUploadErrorType,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ProofUploadError';
  }
}

const getProofUploadErrorType = (error: unknown): ProofUploadErrorType => {
  if (error instanceof ProofUploadError) {
    return error.type;
  }

  const apiError = error as {
    response?: {
      status?: number;
      data?: {
        error?: string | { code?: string };
        message?: string;
      };
    };
  };
  const errorCode =
    typeof apiError.response?.data?.error === 'string'
      ? apiError.response.data.error
      : apiError.response?.data?.error?.code;
  const status = apiError.response?.status;

  if (errorCode === 'FILE_TOO_LARGE' || status === 413) {
    return 'fileSize';
  }
  if (errorCode === 'INVALID_FILE_FORMAT' || status === 415) {
    return 'fileFormat';
  }
  return 'serverError';
};

const throwProofUploadError = (error: unknown): never => {
  if (error instanceof ProofUploadError) {
    throw error;
  }

  const apiError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  const message = apiError.response?.data?.message || apiError.message || 'Proof upload failed';
  throw new ProofUploadError(getProofUploadErrorType(error), message);
};

export const manualBankService = {
  async requestProofUploadUrl(transferId: string): Promise<ProofUploadUrlResponse> {
    try {
      const { data } = await apiClient.get<ProofUploadUrlResponse>(
        `/v1/transfers/${transferId}/proof/upload-url`,
      );
      return data;
    } catch (error) {
      return throwProofUploadError(error);
    }
  },

  async uploadProofToS3(
    uploadUrl: string,
    uploadFields: Record<string, string>,
    image: { uri: string; name: string; type: string },
  ): Promise<void> {
    try {
      const formData = new FormData();
      const normalizedFields = Object.fromEntries(
        Object.entries(uploadFields).map(([key, value]) => [key, stripWrappedQuotes(value)]),
      );
      const orderedFields = [
        'key',
        'Content-Type',
        'policy',
        'x-amz-algorithm',
        'x-amz-credential',
        'x-amz-date',
        'x-amz-signature',
      ];
      const appendedFields = new Set<string>();

      orderedFields.forEach((key) => {
        const value = normalizedFields[key];
        if (value !== undefined) {
          formData.append(key, value);
          appendedFields.add(key);
        }
      });
      Object.entries(normalizedFields).forEach(([key, value]) => {
        if (!appendedFields.has(key)) {
          formData.append(key, value);
        }
      });
      formData.append('file', {
        uri: image.uri,
        name: image.name,
        type: normalizedFields['Content-Type'] || image.type,
      } as any);

      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const status = response.status;

      if (!response.ok) {
        const responseBody = (await response.text()).trim().slice(0, 1000);
        const s3Code = responseBody.match(/<Code>(.*?)<\/Code>/)?.[1];
        const s3Message = responseBody.match(/<Message>(.*?)<\/Message>/)?.[1];
        const errorDetails =
          s3Code || s3Message
            ? `${s3Code || 'S3Error'}${s3Message ? `: ${s3Message}` : ''}`
            : responseBody;
        throw new ProofUploadError(
          status === 413 ? 'fileSize' : status === 415 ? 'fileFormat' : 'serverError',
          `Proof upload failed with status ${status}${errorDetails ? `: ${errorDetails}` : ''}`,
          status,
        );
      }
    } catch (error) {
      return throwProofUploadError(error);
    }
  },

  async confirmProofUpload(
    transferId: string,
    payload: ConfirmProofUploadPayload,
  ): Promise<ConfirmProofUploadResponse> {
    try {
      const { data } = await apiClient.post<ConfirmProofUploadResponse>(
        `/v1/transfers/${transferId}/proof`,
        payload,
      );
      return data;
    } catch (error) {
      return throwProofUploadError(error);
    }
  },

  async submitProof(
    transferId: string,
    imageUri: string,
    contentType: string,
    fileName?: string | null,
  ): Promise<ConfirmProofUploadResponse> {
    if (!transferId || !imageUri) {
      throw new ProofUploadError('serverError', 'Transfer ID and proof image are required');
    }
    const { data: proofUploadUrl } = await this.requestProofUploadUrl(transferId);
    await this.uploadProofToS3(proofUploadUrl.uploadUrl, proofUploadUrl.uploadFields, {
      uri: imageUri,
      name: fileName || getFileName(imageUri),
      type: contentType,
    });
    return this.confirmProofUpload(transferId, { fileKey: proofUploadUrl.fileKey });
  },
};

const stripWrappedQuotes = (value: string) => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const getFileName = (uri: string) => {
  const fileName = uri.split('/').pop()?.split('?')[0];
  return fileName || 'proof.jpg';
};
