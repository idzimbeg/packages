// ===== BASE TYPES =====
export interface BaseUser {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export type SocialProvider =
  | "google"
  | "github"
  | "facebook"
  | "twitter"
  | "apple"
  | string;

export interface SocialAuthOptions {
  provider: SocialProvider;
  redirectUri?: string;
  state?: string;
}

// ===== AUTH RESPONSE =====
export interface AuthResponse<TUser> {
  user: TUser;
  token: string;
}

// ===== API CLIENT INTERFACE =====
export interface AuthApiClient<
  TUser extends BaseUser = BaseUser,
  TLoginCredentials = LoginCredentials,
  TRegisterData = RegisterData
> {
  login: (credentials: TLoginCredentials) => Promise<AuthResponse<TUser>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<TUser>;
  register?: (data: TRegisterData) => Promise<AuthResponse<TUser>>;
  refreshToken?: () => Promise<{ token: string }>;
  socialLogin?: (options: SocialAuthOptions) => Promise<AuthResponse<TUser>>;
  getSocialAuthUrl?: (options: SocialAuthOptions) => string;
}

// ===== STORAGE INTERFACE =====
export interface AuthStorage {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

// ===== ROUTES CONFIG =====
export interface AuthRoutes {
  login: string;
  register?: string;
  afterLogin: string;
  afterLogout: string;
}

// ===== THEME CONFIG =====
export interface AuthTheme {
  form?: string;
  card?: string;
  cardHeader?: string;
  cardTitle?: string;
  cardDescription?: string;
  cardContent?: string;
  field?: string;
  label?: string;
  input?: string;
  inputError?: string;
  button?: string;
  buttonLoading?: string;
  error?: string;
  link?: string;
  socialContainer?: string;
  socialButton?: string;
  socialButtonLoading?: string;
  divider?: string;
  dividerText?: string;
}

// ===== MAIN CONFIG =====
export interface AuthConfig<
  TUser extends BaseUser = BaseUser,
  TLoginCredentials = LoginCredentials,
  TRegisterData = RegisterData
> {
  apiClient: AuthApiClient<TUser, TLoginCredentials, TRegisterData>;
  storage: AuthStorage;
  routes: AuthRoutes;
  theme?: AuthTheme;
  onAuthSuccess?: (user: TUser) => void;
  onAuthError?: (error: Error) => void;
  onLogout?: () => void;
}

// ===== CONTEXT VALUE =====
export interface AuthContextValue<TUser extends BaseUser = BaseUser> {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register?: (data: RegisterData) => Promise<void>;
}
