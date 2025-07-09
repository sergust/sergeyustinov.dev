'use client';

import { ReactNode } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Glass } from './Glass';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole = 'user',
  fallbackPath = '/sign-in',
}: ProtectedRouteProps) {
  const { isLoading, isSignedIn, userRole } = useAuthContext();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Glass variant="enhanced" className="p-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-white">Loading...</p>
        </Glass>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    redirect(fallbackPath);
  }

  // Check role permissions
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Glass variant="enhanced" className="max-w-md p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-6 text-white/70">
            You don&apos;t have permission to access this area. Admin privileges
            are required.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go Home
          </Link>
        </Glass>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
