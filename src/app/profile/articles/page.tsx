'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Edit, Plus, Trash2, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useAuth } from '@/context/AuthContext';
import { getSpecialistByUserId, getArticlesBySpecialist, deleteArticle } from '@/lib/api-services';
import type { StrapiEntity, Specialist, Article, StrapiImage } from '@/types';

export default function SpecialistArticlesPage() {
  const { user, isSpecialist } = useAuth();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<StrapiEntity<Specialist> | null>(null);
  const [articles, setArticles] = useState<StrapiEntity<Article>[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<StrapiEntity<Article> | null>(null);

  // Загрузка данных специалиста и статей
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isSpecialist()) {
        setLoading(false);
        return;
      }

      try {
        // Получаем данные специалиста
        const specialistResponse = await getSpecialistByUserId(user.id);
        if (specialistResponse.data.length === 0) {
          toast.error('Профиль специалиста не найден');
          setLoading(false);
          return;
        }

        // Получаем данные специалиста из первого элемента массива
        setSpecialist(specialistResponse.data[0]);

        // Получаем статьи специалиста
        const articlesResponse = await getArticlesBySpecialist(specialistResponse.data[0].id);
        if (Array.isArray(articlesResponse.data)) {
          setArticles(articlesResponse.data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isSpecialist]);

  // Обработчик открытия диалога подтверждения удаления
  const handleDeleteClick = (article: StrapiEntity<Article>) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  // Обработчик подтверждения удаления
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete.id);
      
      // Обновляем список статей
      setArticles(prevArticles => 
        prevArticles.filter(article => article.id !== articleToDelete.id)
      );
      
      toast.success('Статья успешно удалена');
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
      toast.error('Не удалось удалить статью');
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  // Форматирование даты публикации
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Проверка, авторизован ли пользователь как специалист
  if (!loading && (!user || !isSpecialist())) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Доступ ограничен</h1>
        <p className="mt-2 text-gray-600">
          Эта страница доступна только для специалистов. 
        </p>
      </div>
    );
  }

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Мои статьи</h1>
        
        <Button onClick={() => router.push('/profile/articles/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Новая статья
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Calendar className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium">У вас пока нет статей</h3>
            <p className="mb-4 text-center text-gray-500">
              Создайте свою первую статью, чтобы делиться знаниями и опытом с клиентами
            </p>
            <Button onClick={() => router.push('/profile/articles/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Создать статью
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              {article.attributes.image && (
                <div className="aspect-video w-full">
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${(article.attributes.image as StrapiImage).data.attributes.url}`}
                    alt={article.attributes.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{article.attributes.title}</CardTitle>
                <div className="flex text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatPublishedDate(article.attributes.publishedAt)}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="mb-4 text-gray-600 line-clamp-2">
                  {article.attributes.excerpt}
                </p>
                
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/profile/articles/edit/${article.id}`)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Изменить
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteClick(article)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                  
                  <Link 
                    href={`/blog/${article.attributes.slug}`} 
                    target="_blank"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Просмотр
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы действительно хотите удалить статью "{articleToDelete?.attributes.title}"?
              Это действие нельзя будет отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 