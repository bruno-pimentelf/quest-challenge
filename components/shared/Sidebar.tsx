'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Presentation, Users, Settings, LogOut } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: Presentation, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Entrar em Sala', href: '/join' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isVisible } = useSidebar();

  if (!isVisible) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 h-screen w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-2 z-50">
        {/* Logo */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-xl font-bold text-primary">T</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => router.push(item.href)}
                    className={`w-full h-12 rounded-lg flex items-center justify-center transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="w-full px-2 space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-full h-12 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                <Settings className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Configurações</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
