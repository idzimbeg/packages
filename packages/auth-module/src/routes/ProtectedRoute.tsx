import * as React from "react";
import type { AuthContextValue, BaseUser } from "../entities/auth/model/types";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  requiredRoles?: string[];
  onUnauthenticated?: () => void;
  onUnauthorized?: () => void;
}

// Default loading component
const DefaultLoading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <svg
      className="h-8 w-8 animate-spin text-primary"
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
  </div>
);

// Default unauthorized component
const DefaultUnauthorized = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
    <p className="text-muted-foreground">
      You don't have permission to view this page.
    </p>
  </div>
);

// Default unauthenticated component
const DefaultUnauthenticated = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold">Authentication Required</h1>
    <p className="text-muted-foreground">Please sign in to continue.</p>
  </div>
);

export function createProtectedRoute<TUser extends BaseUser>(
  useAuth: () => AuthContextValue<TUser>,
  hasRole?: (user: TUser, role: string) => boolean
) {
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback,
    loadingFallback,
    requiredRoles,
    onUnauthenticated,
    onUnauthorized,
  }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const hasCalledCallback = React.useRef(false);

    // Handle loading state
    if (isLoading) {
      return <>{loadingFallback ?? <DefaultLoading />}</>;
    }

    // Handle unauthenticated
    if (!isAuthenticated || !user) {
      if (onUnauthenticated && !hasCalledCallback.current) {
        hasCalledCallback.current = true;
        // Use setTimeout to avoid calling during render
        setTimeout(() => onUnauthenticated(), 0);
      }
      return <>{fallback ?? <DefaultUnauthenticated />}</>;
    }

    // Handle role-based access
    if (requiredRoles && requiredRoles.length > 0 && hasRole) {
      const hasRequiredRole = requiredRoles.some((role) => hasRole(user, role));
      if (!hasRequiredRole) {
        if (onUnauthorized && !hasCalledCallback.current) {
          hasCalledCallback.current = true;
          setTimeout(() => onUnauthorized(), 0);
        }
        return <>{fallback ?? <DefaultUnauthorized />}</>;
      }
    }

    // Reset callback ref when authenticated and authorized
    hasCalledCallback.current = false;

    return <>{children}</>;
  };

  ProtectedRoute.displayName = "ProtectedRoute";

  return ProtectedRoute;
}
