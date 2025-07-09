'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'bg-white/10 backdrop-blur-md border border-white/20',
          headerTitle: 'text-white',
          headerSubtitle: 'text-white/70',
          socialButtonsBlockButton:
            'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
          formFieldInput:
            'bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50',
          footerActionLink: 'text-blue-400 hover:text-blue-300',
        },
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: 'transparent',
          colorInputBackground: 'rgba(255, 255, 255, 0.1)',
          colorInputText: '#ffffff',
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <AuthProvider>{children}</AuthProvider>
    </ClerkProvider>
  );
}
