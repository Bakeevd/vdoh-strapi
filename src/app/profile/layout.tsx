'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Calendar,
  FileText,
  Star,
  Settings,
  Users,
  Briefcase,
  BarChart,
  MessageSquare
} from 'lucide-react';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const { user, isAuthenticated, loading, isAdmin, isSpecialist } = useAuth();
  const router = useRouter();

  // Редирект на страницу входа, если пользователь не авторизован
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Будет редирект через useEffect
  }

  // Формируем список пунктов навигации в зависимости от роли пользователя
  const navigationItems = [
    { name: 'Профиль', href: '/profile', icon: User },
    { name: 'Мои записи', href: '/profile/bookings', icon: Calendar },
  ];

  // Если пользователь - специалист или админ, добавляем соответствующие пункты
  if (isSpecialist()) {
    navigationItems.push(
      { name: 'Мои статьи', href: '/profile/articles', icon: FileText },
      { name: 'Мои отзывы', href: '/profile/reviews', icon: Star },
      { name: 'Расписание', href: '/profile/schedule', icon: Calendar },
    );
  }

  // Если пользователь - админ, добавляем пункты администратора
  if (isAdmin()) {
    navigationItems.push(
      { name: 'Услуги', href: '/profile/admin/services', icon: Briefcase },
      { name: 'Специалисты', href: '/profile/admin/specialists', icon: Users },
      { name: 'Все отзывы', href: '/profile/admin/reviews', icon: Star },
      { name: 'Все статьи', href: '/profile/admin/articles', icon: FileText },
      { name: 'Статистика', href: '/profile/admin/stats', icon: BarChart },
      { name: 'Обращения', href: '/profile/admin/contacts', icon: MessageSquare },
    );
  }

  // Добавляем пункт настроек для всех пользователей
  navigationItems.push({ name: 'Настройки', href: '/profile/settings', icon: Settings });

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Боковая навигация */}
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Основной контент */}
        <div className="md:col-span-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 