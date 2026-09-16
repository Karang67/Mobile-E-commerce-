import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  isSupabaseConfigured, 
  sendEmailOtp as supabaseSendOtp, 
  verifyEmailOtp as supabaseVerifyOtp, 
  signOutUser,
  AuthResponse 
} from '../utils/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authWarning: string | null;
  authMode: 'signup' | 'signin';
  setAuthMode: (mode: 'signup' | 'signin') => void;
  openAuthModal: (warningMessage?: string, callbackOnSuccess?: () => void, initialMode?: 'signup' | 'signin') => void;
  closeAuthModal: () => void;
  sendOtp: (email: string) => Promise<AuthResponse>;
  verifyOtp: (email: string, token: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  successCallback: (() => void) | null;
}

const AUTH_USER_STORAGE_KEY = 'shivangi_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authWarning, setAuthWarning] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(null);

  // Initialize session from Supabase or localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const authUser: AuthUser = {
              id: data.session.user.id,
              email: data.session.user.email || '',
            };
            setUser(authUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authUser));
          }
        } catch (e) {
          console.error('Error fetching Supabase session:', e);
        }

        // Listen for Supabase auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
            };
            setUser(authUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authUser));
          } else {
            setUser(null);
            localStorage.removeItem(AUTH_USER_STORAGE_KEY);
          }
        });

        setIsLoading(false);
        return () => {
          listener.subscription.unsubscribe();
        };
      } else {
        // Local persisted session check
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const openAuthModal = (warningMessage?: string, callbackOnSuccess?: () => void, initialMode?: 'signup' | 'signin') => {
    setAuthWarning(warningMessage || 'Please sign in or create an account to proceed with your order.');
    if (initialMode) {
      setAuthMode(initialMode);
    }
    if (callbackOnSuccess) {
      setSuccessCallback(() => callbackOnSuccess);
    } else {
      setSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthWarning(null);
  };

  const sendOtp = async (email: string): Promise<AuthResponse> => {
    return await supabaseSendOtp(email);
  };

  const verifyOtp = async (email: string, token: string): Promise<AuthResponse> => {
    const result = await supabaseVerifyOtp(email, token);
    if (result.success && result.user) {
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
      };
      setUser(authUser);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authUser));

      // Link to user profile in localStorage so email is prefilled everywhere
      try {
        const profileRaw = localStorage.getItem('shivangi_user_profile');
        const profile = profileRaw ? JSON.parse(profileRaw) : {};
        localStorage.setItem(
          'shivangi_user_profile',
          JSON.stringify({
            ...profile,
            email: authUser.email,
            memberSince: profile.memberSince || new Date().getFullYear().toString(),
          })
        );
      } catch {
        // ignore
      }

      // Close modal and execute callback if any
      setIsAuthModalOpen(false);
      setAuthWarning(null);

      if (successCallback) {
        successCallback();
        setSuccessCallback(null);
      }
    }
    return result;
  };

  const logout = async (): Promise<void> => {
    await signOutUser();
    setUser(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        isAuthModalOpen,
        authWarning,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        logout,
        successCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
