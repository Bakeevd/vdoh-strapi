'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isSpecialist: () => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Проверка токена при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get<User>('/users/me?populate=role');
          setUser(response.data);
        }
      } catch (err: any) {
        console.error('Ошибка проверки авторизации:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Авторизация пользователя
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>('/auth/local', credentials);
      const { jwt, user } = response.data;
      
      localStorage.setItem('token', jwt);
      setUser(user);
      toast.success('Вы успешно вошли в систему');
      return true;
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      const errorMessage = err.response?.data?.error?.message || 'Произошла ошибка при входе';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Регистрация пользователя
  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>('/auth/local/register', data);
      const { jwt, user } = response.data;
      
      localStorage.setItem('token', jwt);
      setUser(user);
      toast.success('Регистрация успешно завершена');
      return true;
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);
      const errorMessage = err.response?.data?.error?.message || 'Произошла ошибка при регистрации';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Вы вышли из системы');
    router.push('/');
  };

  // Проверка роли администратора
  const isAdmin = (): boolean => {
    return !!user && user.role?.type === 'admin';
  };

  // Проверка роли специалиста
  const isSpecialist = (): boolean => {
    return !!user && (user.role?.type === 'specialist' || user.role?.type === 'admin');
  };

  // Очистка ошибок
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isAdmin,
        isSpecialist,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 