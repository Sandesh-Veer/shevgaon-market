import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  RecaptchaVerifier, 
  onAuthStateChanged, 
  signOut, 
  signInWithPhoneNumber
} from 'firebase/auth';
import type { User, ConfirmationResult, RecaptchaVerifier as RecaptchaVerifierType } from '@firebase/auth-types';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export type UserRole = 'admin' | 'merchant' | null;

export interface UserProfile {
  uid: string;
  phoneNumber: string | null;
  role: UserRole;
  displayName?: string;
  shopName?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  confirmationResult: ConfirmationResult | null;
  setupRecaptcha: (containerId?: string) => RecaptchaVerifierType;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otpCode: string) => Promise<{ success: boolean; role: UserRole; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifierType | null>(null);

  const adminPhoneNumber = import.meta.env.VITE_ADMIN_PHONE_NUMBER || '+919876543210';

  // Determine user role strictly from phone number or Firestore profile
  const determineRole = (phoneNumber: string | null, firestoreRole?: string): UserRole => {
    if (!phoneNumber) return 'merchant';
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const cleanAdminPhone = adminPhoneNumber.replace(/\s+/g, '');
    
    if (cleanPhone === cleanAdminPhone || firestoreRole === 'admin') {
      return 'admin';
    }
    return 'merchant';
  };

  // Sync or create initial user document in Firestore 'users' collection
  const syncUserDocument = async (authUser: User): Promise<UserProfile> => {
    try {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);

      const computedRole = determineRole(authUser.phoneNumber, userSnap.exists() ? userSnap.data()?.role : undefined);

      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: authUser.uid,
          phoneNumber: authUser.phoneNumber,
          role: computedRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, newProfile);
        return newProfile;
      } else {
        const existingData = userSnap.data() as UserProfile;
        const updatedProfile: UserProfile = {
          ...existingData,
          uid: authUser.uid,
          phoneNumber: authUser.phoneNumber || existingData.phoneNumber,
          role: computedRole,
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, { role: computedRole, updatedAt: serverTimestamp() }, { merge: true });
        return updatedProfile;
      }
    } catch (err) {
      console.error('Error syncing user document in Firestore:', err);
      const fallbackRole = determineRole(authUser.phoneNumber);
      return {
        uid: authUser.uid,
        phoneNumber: authUser.phoneNumber,
        role: fallbackRole
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser as User);
        const profile = await syncUserDocument(currentUser as User);
        setUserProfile(profile);
        setRole(profile.role);
      } else {
        setUser(null);
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize Invisible RecaptchaVerifier
  const setupRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifierType => {
    if (recaptchaVerifier) {
      return recaptchaVerifier;
    }
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // Recaptcha resolved
      },
      'expired-callback': () => {
        console.warn('Recaptcha expired');
      }
    }) as unknown as RecaptchaVerifierType;
    setRecaptchaVerifier(verifier);
    return verifier;
  };

  // Send OTP to 10-digit mobile number with auto prefix +91
  const sendOtp = async (phoneNumber: string): Promise<boolean> => {
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const formattedPhone = cleanNumber.startsWith('91') && cleanNumber.length === 12 
        ? `+${cleanNumber}` 
        : `+91${cleanNumber}`;

      const verifier = recaptchaVerifier || setupRecaptcha('recaptcha-container');
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier as any);
      setConfirmationResult(confirmation);
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      // Clear recaptcha verifier on failure so it can re-render
      setRecaptchaVerifier(null);
      throw error;
    }
  };

  // Verify OTP Code
  const verifyOtp = async (otpCode: string): Promise<{ success: boolean; role: UserRole; error?: string }> => {
    if (!confirmationResult) {
      return { success: false, role: null, error: 'OTP session expired. Please request a new OTP.' };
    }
    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const authUser = userCredential.user;
      if (!authUser) {
        return { success: false, role: null, error: 'User authentication failed.' };
      }
      setUser(authUser as User);

      const profile = await syncUserDocument(authUser as User);
      setUserProfile(profile);
      setRole(profile.role);

      return { success: true, role: profile.role };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return { success: false, role: null, error: error.message || 'Invalid OTP entered.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setRole(null);
    setConfirmationResult(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role,
        loading,
        confirmationResult,
        setupRecaptcha,
        sendOtp,
        verifyOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
