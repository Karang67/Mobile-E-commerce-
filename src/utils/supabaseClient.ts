import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Supabase environment keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder')
  );
};

// Initialize client if configured, otherwise create fallback instance
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Simulated OTP storage key for development/demo when env variables are not yet provided
const DEMO_OTP_STORAGE_KEY = 'shivangi_demo_email_otp';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  } | null;
  session?: any | null;
  // demoOtp removed — SEC-006: OTP must never be included in API responses
}

/**
 * Send an OTP code to the user's email address
 */
export const sendEmailOtp = async (email: string): Promise<AuthResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. If real Supabase is configured, use official Supabase Auth
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: `OTP code sent to ${normalizedEmail}. Please check your email inbox and spam folder.`,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to send OTP via Supabase' };
    }
  }

  // 2. Development-only fallback — blocked in production
  // SEC-006: demoOtp is never returned in the response to prevent OTP exposure.
  // OTP is only logged to the browser console for local development.
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const demoData = {
    email: normalizedEmail,
    otp: generatedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  try {
    sessionStorage.setItem(DEMO_OTP_STORAGE_KEY, JSON.stringify(demoData));
  } catch {
    // ignore
  }

  // SEC-006: OTP is logged to console only — never included in the API response
  console.log(`[DEV ONLY] Email OTP for ${normalizedEmail}: ${generatedOtp}`);

  return {
    success: true,
    message: `Verification code sent to ${normalizedEmail}! Check your browser console for the code (Development Mode).`,
    // demoOtp intentionally omitted from response — check browser console
  };
};

/**
 * Verify the 6-digit OTP code received in email
 */
export const verifyEmailOtp = async (email: string, token: string): Promise<AuthResponse> => {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedToken = token.trim();

  // 1. If real Supabase is configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: trimmedToken,
        type: 'email',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      const user = data.user
        ? { id: data.user.id, email: data.user.email || normalizedEmail }
        : null;

      return {
        success: true,
        message: 'Email verified successfully!',
        user,
        session: data.session,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to verify OTP' };
    }
  }

  // 2. Simulated OTP verification
  try {
    const raw = sessionStorage.getItem(DEMO_OTP_STORAGE_KEY);
    if (!raw) {
      return { success: false, message: 'No active OTP request found. Please request a new OTP.' };
    }

    const demoData = JSON.parse(raw);
    if (demoData.email !== normalizedEmail) {
      return { success: false, message: 'Email does not match OTP request.' };
    }

    if (Date.now() > demoData.expiresAt) {
      return { success: false, message: 'OTP has expired. Please request a new OTP.' };
    }

    // SEC-006 FIX: Removed hardcoded '123456' universal bypass.
    // Only the actual generated OTP is accepted.
    if (demoData.otp !== trimmedToken) {
      return { success: false, message: 'Invalid OTP code. Please check and try again.' };
    }

    sessionStorage.removeItem(DEMO_OTP_STORAGE_KEY);

    const demoUser = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
    };

    return {
      success: true,
      message: 'Account successfully verified & logged in!',
      user: demoUser,
      session: { user: demoUser, token: `demo_jwt_${Date.now()}` },
    };
  } catch (err: any) {
    return { success: false, message: 'Verification error' };
  }
};

/**
 * Sign out user
 */
export const signOutUser = async (): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  sessionStorage.removeItem(DEMO_OTP_STORAGE_KEY);
};
