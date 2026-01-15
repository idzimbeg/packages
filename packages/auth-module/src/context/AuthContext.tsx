import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import type {
  AuthConfig,
  AuthContextValue,
  BaseUser,
  LoginCredentials,
  RegisterData,
} from "../entities/auth/model/types";

// Create context with null default
const AuthContext = React.createContext<AuthContextValue<BaseUser> | null>(
  null
);

// Query key for current user
const AUTH_QUERY_KEY = ["auth", "currentUser"] as const;

// ===== PROVIDER FACTORY =====
export function createAuthProvider<
  TUser extends BaseUser,
  TLoginCredentials extends LoginCredentials,
  TRegisterData extends RegisterData
>(config: AuthConfig<TUser, TLoginCredentials, TRegisterData>) {
  const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const queryClient = useQueryClient();

    // Query for current user
    const {
      data: user,
      isLoading,
      error: queryError,
    } = useQuery({
      queryKey: AUTH_QUERY_KEY,
      queryFn: async (): Promise<TUser | null> => {
        const token = config.storage.getToken();
        if (!token) return null;

        try {
          return await config.apiClient.getCurrentUser();
        } catch {
          config.storage.removeToken();
          return null;
        }
      },
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });

    // Login mutation
    const loginMutation = useMutation({
      mutationFn: (credentials: TLoginCredentials) =>
        config.apiClient.login(credentials),
      onSuccess: ({ user, token }) => {
        config.storage.setToken(token);
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        config.onAuthSuccess?.(user);
      },
      onError: (error: Error) => {
        config.onAuthError?.(error);
      },
    });

    // Register mutation
    const registerMutation = useMutation({
      mutationFn: (data: TRegisterData) => {
        if (!config.apiClient.register) {
          throw new Error("Registration is not configured");
        }
        return config.apiClient.register(data);
      },
      onSuccess: ({ user, token }) => {
        config.storage.setToken(token);
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        config.onAuthSuccess?.(user);
      },
      onError: (error: Error) => {
        config.onAuthError?.(error);
      },
    });

    // Logout mutation
    const logoutMutation = useMutation({
      mutationFn: () => config.apiClient.logout(),
      onSuccess: () => {
        config.storage.removeToken();
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        queryClient.clear();
        config.onLogout?.();
      },
    });

    const value: AuthContextValue<TUser> = {
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading,
      error: queryError ?? loginMutation.error ?? registerMutation.error,
      login: async (credentials) => {
        await loginMutation.mutateAsync(credentials as TLoginCredentials);
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      register: config.apiClient.register
        ? async (data) => {
            await registerMutation.mutateAsync(data as TRegisterData);
          }
        : undefined,
    };

    return (
      <AuthContext.Provider value={value as AuthContextValue<BaseUser>}>
        {children}
      </AuthContext.Provider>
    );
  };

  AuthProvider.displayName = "AuthProvider";

  return AuthProvider;
}

// ===== HOOK FACTORY =====
export function createAuthHook<TUser extends BaseUser>() {
  return function useAuth(): AuthContextValue<TUser> {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context as AuthContextValue<TUser>;
  };
}

export { AuthContext };
