'use client';

import Link from 'next/link';
import { Glass } from './Glass';
import { UserButton } from './UserButton';
import { useAuthContext } from '@/contexts/AuthContext';

export function Navigation() {
  const { isAdmin } = useAuthContext();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 p-4">
      <Glass variant="enhanced" className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-xl font-bold text-white transition-colors hover:text-blue-300"
          >
            Glass Blog
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Search
            </Link>
            <Link
              href="/subscribe"
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Subscribe
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-orange-300 transition-colors hover:text-orange-200"
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Button */}
          <UserButton />
        </div>
      </Glass>
    </nav>
  );
}
