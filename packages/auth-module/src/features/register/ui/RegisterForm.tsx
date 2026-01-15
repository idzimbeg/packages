import * as React from "react";

import { Loading } from "../../../shared/ui/Loading";
import type { AuthContextValue, AuthTheme, BaseUser } from "../../../entities/auth/model/types";

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
};

export interface RegisterFormProps {
  theme?: AuthTheme;
  onSuccess?: () => void;
  onLoginClick?: () => void;
  title?: string;
  description?: string;
  submitText?: string;
  showLoginLink?: boolean;
  loginLinkText?: string;
  showNameField?: boolean;
  showConfirmPassword?: boolean;
}

export function createRegisterForm(
  useAuth: () => AuthContextValue<BaseUser>,
  defaultTheme?: AuthTheme
) {
  const RegisterForm: React.FC<RegisterFormProps> = ({
    theme: propTheme,
    onSuccess,
    onLoginClick,
    title = "Create an account",
    description = "Enter your details to get started",
    submitText = "Sign up",
    showLoginLink = true,
    loginLinkText = "Already have an account? Sign in",
    showNameField = true,
    showConfirmPassword = true,
  }) => {
    const { register, isLoading, error } = useAuth();
    const theme = { ...defaultStyles, ...defaultTheme, ...propTheme };

    const [formData, setFormData] = React.useState({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
    const [localError, setLocalError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError(null);

      if (!register) {
        setLocalError("Registration is not available");
        return;
      }

      if (
        showConfirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        setLocalError("Passwords do not match");
        return;
      }

      setIsSubmitting(true);

      try {
        await register({
          email: formData.email,
          password: formData.password,
          name: showNameField ? formData.name : undefined,
        });
        onSuccess?.();
      } catch (err) {
        setLocalError(
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const displayError = localError ?? (error?.message || null);
    const loading = isLoading || isSubmitting;

    if (!register) {
      return (
        <div className={theme.card}>
          <div className={theme.error}>Registration is not configured</div>
        </div>
      );
    }

    return (
      <div className={theme.card}>
        <div className={theme.cardHeader}>
          <h2 className={theme.cardTitle}>{title}</h2>
          <p className={theme.cardDescription}>{description}</p>
        </div>

        <div className={theme.cardContent}>
          <form onSubmit={handleSubmit} className={theme.form}>
            {displayError && (
              <div className={theme.error} role="alert">
                {displayError}
              </div>
            )}

            {showNameField && (
              <div className={theme.field}>
                <label htmlFor="name" className={theme.label}>
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={theme.input}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            )}

            <div className={theme.field}>
              <label htmlFor="email" className={theme.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
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
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className={theme.input}
                placeholder="Create a password"
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {showConfirmPassword && (
              <div className={theme.field}>
                <label htmlFor="confirmPassword" className={theme.label}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className={theme.input}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${theme.button} ${
                loading ? theme.buttonLoading : ""
              }`}
            >
              {loading ? <Loading /> : submitText}
            </button>

            {showLoginLink && onLoginClick && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className={theme.link}
                >
                  {loginLinkText}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  RegisterForm.displayName = "RegisterForm";

  return RegisterForm;
}
