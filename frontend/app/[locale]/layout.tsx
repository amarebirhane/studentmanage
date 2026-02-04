import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SocketClient } from '@/components/socket-client';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Student Management System',
    description: 'Manage students efficiently',
};

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'am' }, { locale: 'or' }, { locale: 'ti' }];
}

export default async function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Validate that the incoming `locale` parameter is valid
    if (!['en', 'am', 'or', 'ti'].includes(locale)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SocketClient />
                        {children}
                        <Toaster position="top-right" />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
