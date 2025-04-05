import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Layout from '@/components/layout/Layout';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Вдохновение | Центр духовных практик',
  description: 'Центр духовных практик "Вдохновение" - пространство для йоги, медитации и личностного роста.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
