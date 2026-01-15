import type { SocialProvider } from "../../entities/auth/model/types";

export const getDefaultSocialProviderName = (
  provider: SocialProvider
): string => {
  const name = provider.charAt(0).toUpperCase() + provider.slice(1);
  return name;
};
