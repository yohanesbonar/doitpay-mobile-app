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

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

// Local stubs for manual-bank proof upload.
export const manualBankService = {
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
