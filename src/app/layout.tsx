/**
 * Root Layout Component - Stealth Coder Application Shell
 *
 * This is the root layout component for the Next.js application. It provides
 * the HTML structure, global styles, fonts, and essential UI components
 * that wrap the entire Stealth Coder application.
 */

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Source_Code_Pro } from 'next/font/google';

/**
 * Inter Font Configuration
 * Primary UI font for headings, buttons, and general text
 * Optimized for readability and modern appearance
 */
const inter = Inter({
  subsets: ['latin'],           // Latin character subset for English
  display: 'swap',              // Prevents font loading flash
  variable: '--font-inter',     // CSS custom property for font access
});

/**
 * Source Code Pro Font Configuration
 * Monospace font for code display and technical content
 * Industry standard for code readability
 */
const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],                 // Latin character subset
  display: 'swap',                    // Smooth font loading
  variable: '--font-source-code-pro', // CSS custom property for code font
});

/**
 * Application Metadata
 * SEO and browser tab information for the Stealth Coder application
 */
export const metadata: Metadata = {
  title: 'Stealth Coder',                    // Browser tab title
  description: 'Your discreet interview assistant', // Meta description
};

/**
 * Root Layout Component
 * Provides the HTML document structure and global application wrapper
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  // Child components to be rendered
}>) {
  return (
    <html
      lang="en"  // Language attribute for accessibility
      className={`dark ${inter.variable} ${sourceCodePro.variable}`}  // Dark theme and font variables
    >
      <body className="bg-transparent">
        {/* Main application content */}
        {children}

        {/* Global toast notification system */}
        <Toaster />
      </body>
    </html>
  );
}
