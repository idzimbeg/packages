# Social Authentication Usage Guide

This guide shows how to use the social sign-in feature added to the auth-module.

## Overview

The hybrid approach includes:

- **Social auth methods** in `AuthApiClient` interface
- **Social provider configuration** in `LoginForm` props
- **Built-in social icons** for Google, GitHub, Facebook, Twitter, and Apple
- **Customizable styling** through `AuthTheme`

## Basic Usage

### 1. Extend Your API Client with Social Methods

```typescript
import type {
  AuthApiClient,
  SocialAuthOptions,
  AuthResponse,
  BaseUser,
} from "@auth-module";

const apiClient: AuthApiClient<BaseUser> = {
  // ... existing methods (login, logout, getCurrentUser)

  // Add social login method
  socialLogin: async (options: SocialAuthOptions) => {
    const response = await fetch("/api/auth/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });

    if (!response.ok) throw new Error("Social login failed");
    return response.json();
  },

  // Add method to get OAuth URL (for redirect flow)
  getSocialAuthUrl: (options: SocialAuthOptions) => {
    const params = new URLSearchParams({
      provider: options.provider,
      redirect_uri:
        options.redirectUri || window.location.origin + "/auth/callback",
      state: options.state || "",
    });
    return `/api/auth/social/url?${params}`;
  },
};
```

### 2. Configure Social Providers in LoginForm

```typescript
import {
  getSocialIcon,
  getDefaultSocialProviderName,
  type SocialProviderConfig,
} from "@auth-module";

function LoginPage() {
  const { LoginForm, useAuth } = authModule;
  const navigate = useNavigate();

  const socialProviders: SocialProviderConfig[] = [
    {
      provider: "google",
      name: "Continue with Google",
      icon: getSocialIcon("google"),
    },
    {
      provider: "github",
      name: "Continue with GitHub",
      icon: getSocialIcon("github"),
    },
    {
      provider: "facebook",
      name: "Continue with Facebook",
      icon: getSocialIcon("facebook"),
    },
  ];

  const handleSocialLogin = async (provider: string) => {
    // Option 1: Redirect flow (for OAuth)
    const authUrl = apiClient.getSocialAuthUrl?.({
      provider,
      redirectUri: window.location.origin + "/auth/callback",
    });
    if (authUrl) {
      window.location.href = authUrl;
    }

    // Option 2: Popup flow
    // const popup = window.open(authUrl, 'Social Login', 'width=600,height=700');
    // Listen for popup completion...

    // Option 3: Direct API call (if using token exchange)
    // await apiClient.socialLogin?.({ provider });
  };

  return (
    <LoginForm
      socialProviders={socialProviders}
      onSocialLogin={handleSocialLogin}
      onSuccess={() => navigate("/dashboard")}
      showSocialDivider={true}
      socialDividerText="Or continue with email"
    />
  );
}
```

### 3. Custom Social Provider Icons

```typescript
import { CustomIcon } from "./icons";

const socialProviders: SocialProviderConfig[] = [
  {
    provider: "custom-oauth",
    name: "Sign in with Custom",
    icon: <CustomIcon className="h-5 w-5" />,
  },
];
```

### 4. Custom Click Handler (Override Default)

```typescript
const socialProviders: SocialProviderConfig[] = [
  {
    provider: "google",
    name: "Continue with Google",
    icon: getSocialIcon("google"),
    // Custom handler overrides onSocialLogin prop
    onClick: async () => {
      console.log("Custom Google auth logic");
      // Open popup, redirect, etc.
    },
  },
];
```

## Advanced Patterns

### OAuth Callback Handler

```typescript
// In your callback route (e.g., /auth/callback)
function AuthCallback() {
  const { useAuth } = authModule;
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      // Exchange code for token
      fetch("/api/auth/social/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Store token and update auth state
          storage.setToken(data.token);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Auth callback failed:", err);
          navigate("/login?error=auth_failed");
        });
    }
  }, []);

  return <div>Completing authentication...</div>;
}
```

### Popup-Based OAuth Flow

```typescript
const handleSocialLogin = async (provider: string) => {
  const authUrl = apiClient.getSocialAuthUrl?.({ provider });
  if (!authUrl) return;

  const width = 600;
  const height = 700;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    authUrl,
    "Social Login",
    `width=${width},height=${height},left=${left},top=${top}`
  );

  // Listen for message from popup
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === "social-auth-success") {
      storage.setToken(event.data.token);
      popup?.close();
      window.location.reload();
    }
  };

  window.addEventListener("message", handleMessage);

  // Cleanup
  const interval = setInterval(() => {
    if (popup?.closed) {
      clearInterval(interval);
      window.removeEventListener("message", handleMessage);
    }
  }, 500);
};
```

## Styling Social Buttons

### Custom Theme

```typescript
const customTheme: AuthTheme = {
  socialContainer: "space-y-2",
  socialButton:
    "flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
  socialButtonLoading: "opacity-50 cursor-wait",
  divider: "relative my-8",
  dividerText: "flex justify-center text-sm font-medium text-gray-500",
};

<LoginForm theme={customTheme} />;
```

## TypeScript Types

```typescript
// Social provider configuration
interface SocialProviderConfig {
  provider: SocialProvider; // 'google' | 'github' | 'facebook' | etc.
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void | Promise<void>;
}

// Social auth options
interface SocialAuthOptions {
  provider: SocialProvider;
  redirectUri?: string;
  state?: string;
}

// LoginForm props
interface LoginFormProps {
  // ... existing props
  socialProviders?: SocialProviderConfig[];
  showSocialDivider?: boolean;
  socialDividerText?: string;
  onSocialLogin?: (provider: SocialProvider) => void | Promise<void>;
}
```

## Server-Side Implementation Example

### Express.js Social Auth Routes

```typescript
// GET /api/auth/social/url - Generate OAuth URL
app.get("/api/auth/social/url", (req, res) => {
  const { provider, redirect_uri, state } = req.query;

  let authUrl: string;

  switch (provider) {
    case "google":
      authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${redirect_uri}&` +
        `response_type=code&` +
        `scope=email profile&` +
        `state=${state}`;
      break;
    // ... other providers
  }

  res.json({ url: authUrl });
});

// POST /api/auth/social/callback - Handle OAuth callback
app.post("/api/auth/social/callback", async (req, res) => {
  const { code, state } = req.body;

  // Exchange code for access token
  // Fetch user info from provider
  // Create or update user in database
  // Generate JWT token

  res.json({ token, user });
});
```

## Security Considerations

1. **CSRF Protection**: Use `state` parameter for OAuth flows
2. **Validate Tokens**: Always verify OAuth tokens server-side
3. **Secure Storage**: Store tokens securely (httpOnly cookies recommended)
4. **HTTPS Only**: Always use HTTPS in production for OAuth callbacks
5. **Redirect URI Validation**: Whitelist allowed redirect URIs

## Migration from Existing Code

If you have an existing LoginForm without social auth:

```typescript
// Before
<LoginForm onSuccess={() => navigate('/dashboard')} />

// After (backward compatible - no breaking changes)
<LoginForm
  onSuccess={() => navigate('/dashboard')}
  socialProviders={providers}  // Optional
  onSocialLogin={handleSocial}  // Optional
/>
```

All social auth props are optional, so existing code continues to work without modifications.
