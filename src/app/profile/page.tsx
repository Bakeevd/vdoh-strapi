'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { CameraIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/api-services';
import { getInitials } from '@/lib/utils';

// Валидационная схема профиля
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно содержать не менее 2 символов' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Настройка формы
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });
  
  // Функция для обработки изменения изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработка отправки формы
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setUpdating(true);
    
    try {
      // Создаем FormData для отправки файла изображения вместе с данными профиля
      const formData = new FormData();
      
      // Добавляем основные данные профиля
      formData.append('name', values.name);
      formData.append('email', values.email);
      if (values.phone) formData.append('phone', values.phone);
      
      // Добавляем изображение, если оно было выбрано
      if (imageFile) {
        formData.append('files.image', imageFile);
      }

      // Обновляем профиль пользователя
      await updateUserProfile(user.id, formData);
      
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      toast.error('Произошла ошибка при обновлении профиля');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Мой профиль</h1>
      
      <div className="mb-8 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt="Preview" />
            ) : (
              <>
                <AvatarImage src={user?.image?.data?.attributes?.url} alt={user?.name} />
                <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
              </>
            )}
          </Avatar>
          <label 
            htmlFor="profile-image" 
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
          >
            <CameraIcon className="h-4 w-4" />
            <input 
              id="profile-image" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </label>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
          {user?.role && (
            <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {user.role.name}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-medium">Информация профиля</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя и фамилия</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={updating || loading} />
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
                    <Input {...field} disabled={updating || loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={updating || loading} 
                      value={field.value || ''} 
                      placeholder="+7 (___) ___-__-__"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={updating || loading}>
              {updating ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 