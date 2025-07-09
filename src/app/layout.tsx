import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { ClerkProviderWrapper } from '@/providers/clerk-provider';
import { TRPCProvider } from '@/providers/trpc-provider';
import { Navigation } from '@/components/Navigation';

// Geist Sans - Modern, clean font perfect for headings and UI
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
});

// Geist Mono - Optimized monospace font for code blocks
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

// Inter - Excellent for body text and long-form reading
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Glass Blog - Modern Developer Blog',
  description:
    'A beautiful, glass-morphism blog built with Next.js, featuring responsive design and optimal typography for the best reading experience.',
  keywords: [
    'blog',
    'web development',
    'glass morphism',
    'next.js',
    'typescript',
  ],
  authors: [{ name: 'Sergey Ustinov' }],
  creator: 'Sergey Ustinov',
  publisher: 'Glass Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <ClerkProviderWrapper>
          <TRPCProvider>
            <Navigation />
            <div className="pt-24">{children}</div>
          </TRPCProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
