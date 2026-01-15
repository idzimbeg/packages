import * as React from "react";
import { cn } from "../../../shared";
import { Loading } from "../../../shared/ui/Loading";
import type {
  AuthContextValue,
  AuthTheme,
  BaseUser,
  SocialProvider,
} from "../../../entities/auth/model/types";

export interface SocialProviderConfig {
  provider: SocialProvider;
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void | Promise<void>;
}

// Default styles that can be overridden via theme
const defaultStyles = {
  form: "space-y-4",
  card: "w-full max-w-md mx-auto",
  cardHeader: "space-y-1",
  cardTitle: "text-2xl font-bold",
  cardDescription: "text-muted-foreground",
  cardContent: "space-y-4",
  field: "space-y-2",
  label: "text-sm font-medium",
  input:
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  inputError: "border-destructive focus-visible:ring-destructive",
  button:
    "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  buttonLoading: "opacity-70 cursor-not-allowed",
  error: "text-sm text-destructive",
  link: "text-sm text-primary hover:underline",
  socialContainer: "space-y-3",
  socialButton:
    "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  socialButtonLoading: "opacity-70 cursor-not-allowed",
  divider: "relative my-6",
  dividerText: "relative flex justify-center text-xs uppercase",
};

export interface LoginFormProps {
  useAuth: () => AuthContextValue<BaseUser>;
  theme?: AuthTheme;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  title?: string;
  description?: string;
  submitText?: string;
  showRegisterLink?: boolean;
  registerLinkText?: string;
  socialProviders?: SocialProviderConfig[];
  showSocialDivider?: boolean;
  socialDividerText?: string;
  onSocialLogin?: (provider: SocialProvider) => void | Promise<void>;
}

export function createLoginForm(
  useAuth: () => AuthContextValue<BaseUser>,
  defaultTheme?: AuthTheme
) {
  const LoginForm: React.FC<Omit<LoginFormProps, "useAuth">> = ({
    theme: propTheme,
    onSuccess,
    onRegisterClick,
    title = "Welcome back",
    description = "Enter your credentials to sign in",
    submitText = "Sign in",
    showRegisterLink = true,
    registerLinkText = "Don't have an account? Sign up",
    socialProviders,
    showSocialDivider = true,
    socialDividerText = "Or continue with",
    onSocialLogin,
  }) => {
    const { login, isLoading, error } = useAuth();
    const theme = { ...defaultStyles, ...defaultTheme, ...propTheme };

    const [credentials, setCredentials] = React.useState({
      email: "",
      password: "",
    });
    const [localError, setLocalError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [socialLoading, setSocialLoading] =
      React.useState<SocialProvider | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError(null);
      setIsSubmitting(true);

      try {
        await login(credentials);
        onSuccess?.();
      } catch (err) {
        setLocalError(
          err instanceof Error ? err.message : "Login failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleSocialLogin = async (provider: SocialProvider) => {
      setLocalError(null);
      setSocialLoading(provider);

      try {
        await onSocialLogin?.(provider);
        onSuccess?.();
      } catch (err) {
        setLocalError(
          err instanceof Error
            ? err.message
            : "Social login failed. Please try again."
        );
      } finally {
        setSocialLoading(null);
      }
    };

    const displayError = localError ?? (error?.message || null);
    const loading = isLoading || isSubmitting;

    return (
      <div className={theme.card}>
        <div className={theme.cardHeader}>
          <h2 className={theme.cardTitle}>{title}</h2>
          <p className={theme.cardDescription}>{description}</p>
        </div>

        <div className={theme.cardContent}>
          {socialProviders && socialProviders.length > 0 && (
            <>
              <div className={theme.socialContainer}>
                {socialProviders.map((config) => {
                  const isSocialLoading = socialLoading === config.provider;
                  const handleClick =
                    config.onClick ||
                    (() => handleSocialLogin(config.provider));

                  return (
                    <button
                      key={config.provider}
                      type="button"
                      onClick={handleClick}
                      disabled={loading || !!socialLoading}
                      className={cn(
                        theme.socialButton,
                        isSocialLoading ? theme.socialButtonLoading : ""
                      )}
                    >
                      {isSocialLoading ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="m4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                            />
                          </svg>
                          Connecting...
                        </>
                      ) : (
                        <>
                          {config.icon}
                          {config.name}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {showSocialDivider && (
                <div className={theme.divider}>
                  <div className={theme.dividerText}>
                    <span className="bg-background px-2 text-muted-foreground">
                      {socialDividerText}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                </div>
              )}
            </>
          )}

          <form onSubmit={handleSubmit} className={theme.form}>
            {displayError && (
              <div className={theme.error} role="alert">
                {displayError}
              </div>
            )}

            <div className={theme.field}>
              <label htmlFor="email" className={theme.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, email: e.target.value }))
                }
                className={theme.input}
                placeholder="name@example.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className={theme.field}>
              <label htmlFor="password" className={theme.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className={cn(theme.input)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(theme.button, loading ? theme.buttonLoading : "")}
            >
              {loading ? <Loading /> : submitText}
            </button>

            {showRegisterLink && onRegisterClick && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className={theme.link}
                >
                  {registerLinkText}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  LoginForm.displayName = "LoginForm";

  return LoginForm;
}
