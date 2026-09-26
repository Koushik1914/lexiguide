import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LexiGuide — AI Legal Document & Rights Navigator',
  description:
    'AI-powered legal information assistant that turns complex contracts, leases, and agreements into clear plain English with source-grounded citations and practical next steps.',
  keywords: [
    'legal AI',
    'contract analysis',
    'legal document navigator',
    'plain English legal',
    'legal access',
    'legal rights',
    'contract comparison',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
