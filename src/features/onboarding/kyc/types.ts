export enum KycStatus {
  UNVERIFIED = 'UNVERIFIED',
  // KYC data submitted, waiting for review.
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  VERIFIED = 'VERIFIED',
}
