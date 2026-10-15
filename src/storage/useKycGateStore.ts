import { create } from 'zustand';
import { KycStatus } from '@/features/onboarding/kyc/types';

// Drives the single KycRequiredSheet rendered in RootNavigator, so any screen can trigger it
// through useKycGate without rendering its own copy.
interface KycGateState {
  gateStatus: KycStatus | null;
  openGate: (status: KycStatus) => void;
  closeGate: () => void;
}

export const useKycGateStore = create<KycGateState>((set) => ({
  gateStatus: null,
  openGate: (status) => set({ gateStatus: status }),
  closeGate: () => set({ gateStatus: null }),
}));
