'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';

export interface AuthContextType {
  // User state
  user: UserResource | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean;

  // Authentication actions
  signOut: () => Promise<void>;

  // User roles and permissions
  isAdmin: boolean;
  userRole: 'admin' | 'user' | null;

  // Profile utilities
  userDisplayName: string;
  userEmail: string;
  userAvatar: string;

  // Loading states
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();

  // Check if user is admin based on metadata or email
  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress === 'sergey@sergeyustinov.dev';

  // Determine user role
  const userRole = isAdmin ? 'admin' : isSignedIn ? 'user' : null;

  // User display utilities
  const userDisplayName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    'User';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userAvatar = user?.imageUrl || '';

  // Loading state
  const isLoading = !isLoaded;

  const contextValue: AuthContextType = {
    user,
    isLoaded,
    isSignedIn: isSignedIn || false,
    signOut,
    isAdmin,
    userRole,
    userDisplayName,
    userEmail,
    userAvatar,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Helper hooks
export function useIsAdmin() {
  const { isAdmin } = useAuthContext();
  return isAdmin;
}

export function useUserRole() {
  const { userRole } = useAuthContext();
  return userRole;
}

export function useUserDisplayName() {
  const { userDisplayName } = useAuthContext();
  return userDisplayName;
}
