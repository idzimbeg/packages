import type { SocialProvider } from "../../entities/auth/model/types";
import {
  AppleIcon,
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../ui/SocialProviderIcons";

export const getSocialIcon = (provider: SocialProvider): React.ReactNode => {
  switch (provider.toLowerCase()) {
    case "google":
      return <GoogleIcon />;
    case "github":
      return <GithubIcon />;
    case "facebook":
      return <FacebookIcon />;
    case "twitter":
      return <TwitterIcon />;
    case "apple":
      return <AppleIcon />;
    default:
      return null;
  }
};
