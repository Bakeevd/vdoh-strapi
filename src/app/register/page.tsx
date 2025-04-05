'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';

// Валидационная схема
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Имя должно содержать не менее 2 символов' }),
    username: z
      .string()
      .min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Имя пользователя может содержать только буквы, цифры и знак подчеркивания',
      }),
    email: z
      .string()
      .min(1, { message: 'Заполните это поле' })
      .email({ message: 'Введите корректный email' }),
    password: z
      .string()
      .min(6, { message: 'Пароль должен содержать не менее 6 символов' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();
  
  // Настройка формы
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // Обработка отправки формы
  const onSubmit = async (values: RegisterFormValues) => {
    const { passwordConfirm, ...registerData } = values;
    const success = await register(registerData);
    if (success) {
      router.push('/profile');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Регистрация</h1>
        <p className="mt-2 text-gray-600">
          Создайте аккаунт для доступа ко всем возможностям центра «Вдохновение»
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя и фамилия</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Иван Иванов"
                    {...field}
                    disabled={loading}
                    onChange={(e) => {
                      clearError();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя пользователя</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ivan_ivanov"
                    {...field}
                    disabled={loading}
                    onChange={(e) => {
                      clearError();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    type="email"
                    {...field}
                    disabled={loading}
                    onChange={(e) => {
                      clearError();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Введите пароль"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      disabled={loading}
                      onChange={(e) => {
                        clearError();
                        field.onChange(e);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтверждение пароля</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Подтвердите пароль"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      disabled={loading}
                      onChange={(e) => {
                        clearError();
                        field.onChange(e);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Уже есть аккаунт? </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
} 