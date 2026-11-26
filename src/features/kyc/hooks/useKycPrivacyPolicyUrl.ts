import { useQuery } from '@tanstack/react-query';
import remoteConfig from '@react-native-firebase/remote-config';
import { KYC_PRIVACY_POLICY_REMOTE_CONFIG_KEY } from '@/features/kyc/kycIntro/termsData';

const fetchKycPrivacyPolicyUrl = async () => {
  try {
    const config = remoteConfig();
    await config.setDefaults({
      [KYC_PRIVACY_POLICY_REMOTE_CONFIG_KEY]: '',
    });
    await config.fetchAndActivate();

    const configuredUrl = config
      .getValue(KYC_PRIVACY_POLICY_REMOTE_CONFIG_KEY)
      .asString()
      .trim();

    if (/^https?:\/\//i.test(configuredUrl)) return configuredUrl;
  } catch {
    // Keep the app usable when Remote Config is unavailable.
  }

  return '';
};

export const useKycPrivacyPolicyUrl = () =>
  useQuery({
    queryKey: ['kyc-privacy-policy-url'],
    queryFn: fetchKycPrivacyPolicyUrl,
    staleTime: 60_000,
    retry: false,
  });
