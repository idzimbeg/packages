import { createProtectedRoute } from "./routes/ProtectedRoute";

import { createAuthHook, createAuthProvider } from "./context/AuthContext";
import { createRegisterForm } from "./features";
import { createLoginForm } from "./features/login/ui/LoginForm";
import type {
  AuthConfig,
  AuthContextValue,
  BaseUser,
  LoginCredentials,
  RegisterData,
} from "./entities/auth/model/types";

// ===== FACTORY FUNCTION =====
export function createAuthModule<
  TUser extends BaseUser = BaseUser,
  TLoginCredentials extends LoginCredentials = LoginCredentials,
  TRegisterData extends RegisterData = RegisterData
>(
  config: AuthConfig<TUser, TLoginCredentials, TRegisterData>,
  options?: {
    hasRole?: (user: TUser, role: string) => boolean;
  }
) {
  // Create provider
  const AuthProvider = createAuthProvider(config);

  // Create hook
  const useAuth = createAuthHook<TUser>();

  // Create components with the hook bound
  const LoginForm = createLoginForm(
    useAuth as () => AuthContextValue<BaseUser>,
    config.theme
  );

  const RegisterForm = createRegisterForm(
    useAuth as () => AuthContextValue<BaseUser>,
    config.theme
  );

  const ProtectedRoute = createProtectedRoute(useAuth, options?.hasRole);

  return {
    AuthProvider,
    useAuth,
    LoginForm,
    RegisterForm,
    ProtectedRoute,
    // Re-export config for reference
    config,
  };
}

// ===== RE-EXPORTS =====
export type {
  AuthApiClient,
  AuthConfig,
  AuthContextValue,
  AuthResponse,
  AuthRoutes,
  AuthStorage,
  AuthTheme,
  BaseUser,
  LoginCredentials,
  RegisterData,
  SocialAuthOptions,
  SocialProvider,
} from "./entities/auth/model/types";

export {
  AuthContext,
  createAuthHook,
  createAuthProvider,
} from "./context/AuthContext";
export {
  createLoginForm,
  type LoginFormProps,
  type SocialProviderConfig,
} from "./features/login/ui/LoginForm";
export {
  createRegisterForm,
  type RegisterFormProps,
} from "./features/register/ui/RegisterForm";
export {
  createProtectedRoute,
  type ProtectedRouteProps,
} from "./routes/ProtectedRoute";
export { cn, getDefaultSocialProviderName, getSocialIcon } from "./shared";
export {
  AppleIcon,
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
  type SocialIconProps,
} from "./shared/ui/SocialProviderIcons";
