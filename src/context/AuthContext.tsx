import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole } from '../types';

const ADMIN_BOOTSTRAP_EMAIL = 'vikasram2321@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync profile from Firestore
  const syncProfile = async (firebaseUser: User) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userRef);
      const isBootstrap = firebaseUser.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // Promote to admin if bootstrap email
        if (isBootstrap && data.role !== 'admin') {
          await updateDoc(userRef, { role: 'admin' });
          data.role = 'admin';
        }
        setProfile(data);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Attendee',
          role: isBootstrap ? 'admin' : 'user',
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Error syncing profile:', err);
      // Fallback profile if Firestore permission or network glitch happens
      const isBootstrap = firebaseUser.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'EventEase User',
        role: isBootstrap ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncProfile(user);
      } else {
        // Check for local demo profile if active
        const storedDemo = localStorage.getItem('eventease_demo_profile');
        if (storedDemo) {
          try {
            setProfile(JSON.parse(storedDemo));
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      localStorage.removeItem('eventease_demo_profile');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncProfile(result.user);
      }
    } catch (err: unknown) {
      console.error('Google Sign-in Error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
      throw err;
    }
  };

  const signInWithDemo = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const demoUser: UserProfile = role === 'admin'
        ? {
            uid: 'demo-admin-id-101',
            email: ADMIN_BOOTSTRAP_EMAIL,
            displayName: 'Vikas Ram (Admin)',
            role: 'admin',
            photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            createdAt: new Date().toISOString(),
            phoneNumber: '+1 (555) 019-2834',
          }
        : {
            uid: 'demo-user-id-202',
            email: 'alex.attendee@eventease.com',
            displayName: 'Alex Morgan',
            role: 'user',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            createdAt: new Date().toISOString(),
            phoneNumber: '+1 (555) 438-9210',
          };

      localStorage.setItem('eventease_demo_profile', JSON.stringify(demoUser));
      setProfile(demoUser);
    } catch (err) {
      console.error('Demo Login Error:', err);
      setError('Could not set demo user profile');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('eventease_demo_profile');
    setProfile(null);
    setCurrentUser(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, data);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    } else {
      localStorage.setItem('eventease_demo_profile', JSON.stringify(updated));
    }
  };

  const clearError = () => setError(null);

  const isAdmin = profile?.role === 'admin' ||
    currentUser?.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        isAdmin,
        loading,
        error,
        signInWithGoogle,
        signInWithDemo,
        signOut,
        updateUserProfile,
        clearError,
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
