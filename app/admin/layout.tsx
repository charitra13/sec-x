'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MeshBackground from '@/app/components/MeshBackground';
import Footer from '@/app/components/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/unauthorized');
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MeshBackground />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
} 