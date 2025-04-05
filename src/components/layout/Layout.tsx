'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#ffffff',
              color: '#333333',
            },
            success: {
              style: {
                border: '1px solid rgba(34, 197, 94, 0.2)',
                background: 'rgba(34, 197, 94, 0.1)',
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              style: {
                border: '1px solid rgba(239, 68, 68, 0.2)',
                background: 'rgba(239, 68, 68, 0.1)',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
};

export default Layout; 