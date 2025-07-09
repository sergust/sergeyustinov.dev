'use client';

import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton as ClerkUserButton,
} from '@clerk/nextjs';
import { Glass } from './Glass';

export function UserButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-medium text-white/90 sm:block">
          Welcome, {user.firstName || user.username}
        </span>
        <ClerkUserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
              userButtonPopoverCard:
                'bg-white/10 backdrop-blur-md border border-white/20',
              userButtonPopoverMain: 'text-white',
              userButtonPopoverFooter: 'text-white/70',
              userButtonPopoverActionButton: 'text-white hover:bg-white/10',
              userButtonPopoverActionButtonText: 'text-white',
              userButtonPopoverActionButtonIcon: 'text-white/70',
            },
            variables: {
              colorPrimary: '#3b82f6',
              colorBackground: 'rgba(255, 255, 255, 0.1)',
              colorInputBackground: 'rgba(255, 255, 255, 0.1)',
              colorInputText: '#ffffff',
              colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '0.5rem',
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <SignInButton mode="redirect">
        <Glass
          variant="light"
          hover
          className="cursor-pointer px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
        >
          Sign In
        </Glass>
      </SignInButton>
      <SignUpButton mode="redirect">
        <Glass
          variant="enhanced"
          hover
          className="cursor-pointer border-blue-400/30 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600/20"
        >
          Sign Up
        </Glass>
      </SignUpButton>
    </div>
  );
}
