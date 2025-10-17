'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';

// Routes where sidebar should be hidden (fullscreen routes)
const FULLSCREEN_ROUTES = ['/live/', '/room/'];

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isVisible, setIsVisible } = useSidebar();

  useEffect(() => {
    // Check if current route is a fullscreen route
    const shouldHide = FULLSCREEN_ROUTES.some(route => pathname.startsWith(route));
    setIsVisible(!shouldHide);
  }, [pathname, setIsVisible]);

  return (
    <>
      <Sidebar />
      <main className={isVisible ? 'ml-16' : ''}>
        {children}
      </main>
    </>
  );
}
