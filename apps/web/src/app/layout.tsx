import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { SmoothScrollProvider } from '@/components/motion/smooth-scroll-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgendaPro - Agendamento Online',
  description: 'Plataforma de agendamento online para barbearias, clinicas, estudios e muito mais.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
        <AuthProvider>
          <QueryProvider>
            <SmoothScrollProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </SmoothScrollProvider>
          </QueryProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
