'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useAuth } from '@/context/AuthContext';
import { getSpecialistByUserId, getCategories, createArticle } from '@/lib/api-services';
import type { StrapiEntity, Specialist, Category } from '@/types';

// Валидационная схема для статьи
const articleSchema = z.object({
  title: z.string().min(5, { message: 'Название должно содержать не менее 5 символов' }),
  excerpt: z.string().min(20, { message: 'Краткое описание должно содержать не менее 20 символов' }),
  content: z.string().min(50, { message: 'Содержание должно содержать не менее 50 символов' }),
  categoryId: z.string().min(1, { message: 'Выберите категорию' }),
  tags: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function NewArticlePage() {
  const { user, isSpecialist } = useAuth();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<StrapiEntity<Specialist> | null>(null);
  const [categories, setCategories] = useState<StrapiEntity<Category>[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Настройка формы
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      tags: '',
    },
  });

  // Загрузка данных специалиста и категорий
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isSpecialist()) {
        router.push('/profile');
        return;
      }

      try {
        // Получаем данные специалиста
        const specialistResponse = await getSpecialistByUserId(user.id);
        
        if (specialistResponse.data.length === 0) {
          toast.error('Профиль специалиста не найден');
          router.push('/profile');
          return;
        }

        // Исправление типа данных для специалиста
        if (Array.isArray(specialistResponse.data) && specialistResponse.data.length > 0) {
          setSpecialist(specialistResponse.data[0] as StrapiEntity<Specialist>);
        }

        // Получаем категории для статей
        const categoriesResponse = await getCategories();
        // Исправление типа данных для категорий
        if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data as StrapiEntity<Category>[]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isSpecialist, router]);

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
  const onSubmit = async (values: ArticleFormValues) => {
    if (!specialist) return;
    
    setSubmitting(true);
    
    try {
      // Создаем объект данных статьи
      const articleData = {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        author: specialist.id,
        category: values.categoryId,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        publishedAt: new Date().toISOString(),
      };
      
      // Создаем FormData для отправки файла изображения вместе с данными статьи
      const formData = new FormData();
      formData.append('data', JSON.stringify(articleData));
      
      // Добавляем изображение, если оно было выбрано
      if (imageFile) {
        formData.append('files.image', imageFile);
      }

      // Создаем новую статью
      await createArticle(formData);
      
      toast.success('Статья успешно создана');
      router.push('/profile/articles');
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
      toast.error('Произошла ошибка при создании статьи');
    } finally {
      setSubmitting(false);
    }
  };

  // Отображение загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Загрузка...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/profile/articles')} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Новая статья</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>
                    Заполните основные данные статьи
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Заголовок</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Введите заголовок статьи" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Краткое описание</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Введите краткое описание статьи"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Это описание будет отображаться в списке статей и анонсах
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Содержание</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Введите полный текст статьи"
                            rows={15}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Дополнительно</CardTitle>
                  <CardDescription>
                    Дополнительные параметры статьи
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            {...field}
                          >
                            <option value="">Выберите категорию</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.attributes.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Теги</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="йога, медитация, практики" />
                        </FormControl>
                        <FormDescription>
                          Введите теги через запятую
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel htmlFor="article-image">Изображение</FormLabel>
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative aspect-video w-full">
                          <img
                            src={imagePreview}
                            alt="Предпросмотр"
                            className="h-full w-full rounded-md object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                          >
                            <span className="sr-only">Удалить</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="article-image"
                          className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4 hover:bg-gray-50"
                        >
                          <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Нажмите для загрузки изображения
                          </span>
                          <span className="mt-1 text-xs text-gray-400">
                            PNG, JPG, WEBP до 10MB
                          </span>
                        </label>
                      )}
                      <input
                        id="article-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profile/articles')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="px-8"
            >
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  Создание...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Опубликовать
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 