import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// context
import { UserProvider } from '@/lib/contexts/userContext';
import { useUserLocation } from '@/hooks/useUserLocation';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Way Transit',
    description: 'AI Journey planning - Way transit',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <UserProvider>{children}</UserProvider>
            </body>
        </html>
    );
}
