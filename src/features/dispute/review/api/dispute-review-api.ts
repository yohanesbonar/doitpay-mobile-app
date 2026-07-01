import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';
import { Buffer } from 'buffer';

const mapS3UploadErrorMessage = (body: string) => {
  const normalized = body.toLowerCase();

  if (
    normalized.includes('credential is mal-formed') ||
    normalized.includes('x-amz-credential') ||
    normalized.includes('<code>invalidargument</code>')
  ) {
    return 'Upload is temporarily unavailable. Please try again shortly.';
  }

  if (normalized.includes('<error>') || normalized.includes('<?xml')) {
    return 'Unable to upload your photo right now. Please try again.';
  }

  return 'Unable to upload your photo right now. Please try again.';
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

const extractCredentialFromPolicy = (policyBase64?: string) => {
  if (!policyBase64) {
    return undefined;
  }

  try {
    const decodedPolicy = Buffer.from(policyBase64, 'base64').toString('utf-8');
    const parsedPolicy = JSON.parse(decodedPolicy) as {
      conditions?: Array<Record<string, string> | string[]>;
    };

    const credentialCondition = parsedPolicy.conditions?.find(
      (condition) =>
        typeof condition === 'object' &&
        !Array.isArray(condition) &&
        typeof condition['x-amz-credential'] === 'string',
    ) as Record<string, string> | undefined;

    return credentialCondition?.['x-amz-credential'];
  } catch {
    return undefined;
  }
};

export interface CreateDisputeDraftPayload {
  customReason: string;
  detail?: string;
  evidenceKeys?: string[];
  orderReferenceId?: string;
  reasonId?: string;
}

export interface CreateDisputeDraftData {
  id: string;
  createdAt?: string;
  detail?: string;
  estimatedAt?: string;
  status?: string;
}

export interface CreateEvidencePresignPayload {
  contentType: string;
  filename: string;
}

export interface CreateEvidencePresignData {
  id: string;
  uploadFields?: Record<string, string>;
  uploadKey?: string;
  uploadUrl: string;
  expiresAt?: string;
}

export const disputeReviewApi = {
  createDraft: async (payload: CreateDisputeDraftPayload) => {
    const { data } = await apiClient.post<ResponseApi<CreateDisputeDraftData>>('/v1/disputes', payload);
    return data;
  },

  createEvidencePresign: async (payload: CreateEvidencePresignPayload) => {
    const { data } = await apiClient.post<ResponseApi<CreateEvidencePresignData>>(
      '/v1/disputes/evidences/presign',
      payload,
    );
    return data;
  },

  uploadEvidenceFile: async (
    uploadUrl: string,
    uploadFields: Record<string, string> | undefined,
    file: { uri: string; name: string; type: string },
  ) => {
    const formData = new FormData();

    const normalizedFields = Object.fromEntries(
      Object.entries(uploadFields || {}).map(([key, value]) => [key, stripWrappedQuotes(String(value))]),
    );

    const credentialField = normalizedFields['x-amz-credential'];
    if (credentialField?.startsWith('sm://')) {
      throw new Error('Upload is temporarily unavailable. Please try again shortly.');
    }

    if (credentialField && credentialField.startsWith('/')) {
      const credentialFromPolicy = extractCredentialFromPolicy(normalizedFields.policy);
      if (credentialFromPolicy) {
        normalizedFields['x-amz-credential'] = credentialFromPolicy;
      }
    }

    if (normalizedFields['x-amz-credential']?.startsWith('/')) {
      throw new Error('Upload is temporarily unavailable. Please try again shortly.');
    }

    // Keep field order close to backend curl examples for easier debugging.
    const appendIfPresent = (key: string) => {
      const value = normalizedFields[key];
      if (value !== undefined) {
        formData.append(key, value);
      }
    };

    appendIfPresent('key');
    appendIfPresent('Content-Type');
    appendIfPresent('policy');
    appendIfPresent('x-amz-algorithm');
    appendIfPresent('x-amz-credential');
    appendIfPresent('x-amz-date');
    appendIfPresent('x-amz-signature');

    Object.entries(normalizedFields)
      .filter(([key]) =>
        ![
          'key',
          'Content-Type',
          'policy',
          'x-amz-algorithm',
          'x-amz-credential',
          'x-amz-date',
          'x-amz-signature',
        ].includes(key),
      )
      .forEach(([key, value]) => {
        formData.append(key, value);
      });

    const resolvedContentType = normalizedFields['Content-Type'] || file.type;

    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: resolvedContentType,
    } as any);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(mapS3UploadErrorMessage(body));
    }
  },
};
