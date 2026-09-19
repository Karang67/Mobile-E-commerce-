import React, { createContext, useContext, useState } from 'react';
import {
  useSignIn,
  useSignUp,
  useUser,
  useClerk,
} from '@clerk/clerk-react';

// Local type guard for Clerk API errors — avoids dependency on non-exported helpers
interface ClerkErrorItem {
  code: string;
  message: string;
  longMessage?: string;
  meta?: { paramName?: string };
}
interface ClerkAPIError {
  errors: ClerkErrorItem[];
  status?: number;
}
function isClerkError(err: unknown): err is ClerkAPIError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'errors' in err &&
    Array.isArray((err as ClerkAPIError).errors) &&
    (err as ClerkAPIError).errors.length > 0
  );
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  } | null;
  session?: unknown | null;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { user: clerkUser, isSignedIn, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authWarning, setAuthWarning] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(null);

  const isLoading = !signInLoaded || !signUpLoaded || !userLoaded;

  // Build AuthUser from Clerk session
  const user: AuthUser | null =
    isSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          fullName: clerkUser.fullName || undefined,
        }
      : null;

  const openAuthModal = (
    warningMessage?: string,
    callbackOnSuccess?: () => void,
    initialMode?: 'signup' | 'signin',
  ) => {
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

  // Shared post-auth logic: sync profile email to localStorage, fire callback, close modal
  const handleAuthSuccess = (userId: string, email: string) => {
    try {
      const profileRaw = localStorage.getItem('shivangi_user_profile');
      const profile = profileRaw ? JSON.parse(profileRaw) : {};
      localStorage.setItem(
        'shivangi_user_profile',
        JSON.stringify({
          ...profile,
          email,
          memberSince: profile.memberSince || new Date().getFullYear().toString(),
        }),
      );
    } catch {
      // ignore
    }

    setIsAuthModalOpen(false);
    setAuthWarning(null);

    if (successCallback) {
      successCallback();
      setSuccessCallback(null);
    }

    // Log for debugging (development only)
    console.log(`[Clerk Auth] User authenticated: ${userId}`);
  };

const generateSecurePassword = (): string => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*()_+~';
  let pwd = '';
  pwd += letters[Math.floor(Math.random() * 24)];
  pwd += letters[24 + Math.floor(Math.random() * 24)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];
  const all = letters + digits + symbols;
  for (let i = 0; i < 16; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd;
};

  /**
   * Send email OTP via Clerk.
   * Routes to signUp (new user) or signIn (existing user) based on authMode.
   */
  const sendOtp = async (email: string): Promise<AuthResponse> => {
    if (!signInLoaded || !signUpLoaded) {
      return { success: false, message: 'Authentication service is still loading. Please try again in a moment.' };
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (authMode === 'signup') {
        // Create sign-up and send email verification OTP
        // Try creating with a generated password to satisfy Clerk instances requiring password
        try {
          await signUp!.create({
            emailAddress: normalizedEmail,
            password: generateSecurePassword(),
          });
        } catch {
          await signUp!.create({ emailAddress: normalizedEmail });
        }
        await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      } else {
        // Send sign-in email OTP
        await signIn!.create({ strategy: 'email_code', identifier: normalizedEmail });
      }

      return {
        success: true,
        message: `OTP code sent to ${normalizedEmail}. Please check your email inbox and spam folder.`,
      };
    } catch (err: unknown) {
      if (isClerkError(err)) {
        const clerkError = err.errors[0];
        // Email already registered — nudge user to sign in
        if (
          clerkError.code === 'form_identifier_exists' ||
          clerkError.code === 'form_password_pwned' ||
          clerkError.meta?.paramName === 'email_address'
        ) {
          return {
            success: false,
            message: 'An account with this email already exists. Please switch to Sign In.',
          };
        }
        // Email not registered — nudge user to sign up
        if (clerkError.code === 'form_identifier_not_found') {
          return {
            success: false,
            message: 'No account found with this email. Please switch to Create Account.',
          };
        }
        return { success: false, message: clerkError.longMessage || clerkError.message };
      }
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  /**
   * Verify the 6-digit email OTP entered by the user.
   */
  const verifyOtp = async (email: string, token: string): Promise<AuthResponse> => {
    if (!signInLoaded || !signUpLoaded) {
      return { success: false, message: 'Authentication service is still loading. Please try again.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedToken = token.trim();

    try {
      if (authMode === 'signup') {
        let result = await signUp!.attemptEmailAddressVerification({ code: trimmedToken });

        // If Clerk reported missing_requirements (e.g. password, first_name), auto-fulfill them
        if (result.status === 'missing_requirements' && result.missingFields && result.missingFields.length > 0) {
          const updatePayload: { password?: string; firstName?: string; lastName?: string } = {};
          if (result.missingFields.includes('password')) {
            updatePayload.password = generateSecurePassword();
          }
          if (result.missingFields.includes('first_name')) {
            updatePayload.firstName = 'Customer';
          }
          if (result.missingFields.includes('last_name')) {
            updatePayload.lastName = 'User';
          }
          if (Object.keys(updatePayload).length > 0) {
            try {
              result = await signUp!.update(updatePayload);
            } catch (updateErr) {
              console.warn('[Clerk SignUp] Failed to auto-fill missing fields:', updateErr);
            }
          }
        }

        if (result.status === 'complete') {
          await setSignUpActive!({ session: result.createdSessionId! });
          const userId = result.createdUserId || result.createdSessionId || '';
          handleAuthSuccess(userId, normalizedEmail);
          return {
            success: true,
            message: 'Account verified & logged in!',
            user: { id: userId, email: normalizedEmail },
          };
        }

        if (result.status === 'missing_requirements') {
          const missing = (result.missingFields || []).join(', ');
          console.warn('[Clerk SignUp] Missing requirements:', result.missingFields, result.unverifiedFields);
          return {
            success: false,
            message: missing
              ? `Verification incomplete: Clerk requires missing field(s): ${missing}. In Clerk Dashboard, please disable or set these fields to optional.`
              : 'Verification incomplete: Clerk requires additional profile fields. Please check Clerk Dashboard settings.',
          };
        }

        return { success: false, message: `Verification status: ${result.status}. Please try again.` };
      } else {
        const result = await signIn!.attemptFirstFactor({ strategy: 'email_code', code: trimmedToken });

        if (result.status === 'complete') {
          await setSignInActive!({ session: result.createdSessionId! });
          const userId = result.createdSessionId || '';
          handleAuthSuccess(userId, normalizedEmail);
          return {
            success: true,
            message: 'Signed in successfully!',
            user: { id: userId, email: normalizedEmail },
          };
        }

        if (result.status === 'needs_second_factor') {
          return { success: false, message: 'Second factor authentication is required.' };
        }

        return { success: false, message: `Sign in incomplete (status: ${result.status}). Please try again.` };
      }
    } catch (err: unknown) {
      if (isClerkError(err)) {
        const clerkError = err.errors[0];
        if (clerkError.code === 'form_code_incorrect') {
          return { success: false, message: 'Invalid OTP code. Please check and try again.' };
        }
        if (clerkError.code === 'verification_expired') {
          return { success: false, message: 'OTP has expired. Please request a new code.' };
        }
        if (clerkError.code === 'too_many_requests') {
          return { success: false, message: 'Too many attempts. Please wait before trying again.' };
        }
        return { success: false, message: clerkError.longMessage || clerkError.message };
      }
      return { success: false, message: 'Verification failed. Please try again.' };
    }
  };

  const logout = async (): Promise<void> => {
    await signOut();
    try {
      localStorage.removeItem('shivangi_auth_user');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(isSignedIn),
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
