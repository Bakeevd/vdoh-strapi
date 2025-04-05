'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { MessageSquare, Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { useAuth } from '@/context/AuthContext';
import { getSpecialistByUserId, getReviewsBySpecialist, updateReview } from '@/lib/api-services';
import type { StrapiEntity, Specialist, Review } from '@/types';

export default function SpecialistReviewsPage() {
  const { user, isSpecialist } = useAuth();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<StrapiEntity<Specialist> | null>(null);
  const [reviews, setReviews] = useState<StrapiEntity<Review>[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [savingReplyId, setSavingReplyId] = useState<number | null>(null);

  // Загрузка данных специалиста и его отзывов
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

        const specialistData = specialistResponse.data[0];
        setSpecialist(specialistData);

        // Получаем отзывы специалиста
        const reviewsResponse = await getReviewsBySpecialist(specialistData.id);
        if (Array.isArray(reviewsResponse.data)) {
          setReviews(reviewsResponse.data);
          
          // Инициализируем текст ответов из существующих данных
          const initialReplies: Record<number, string> = {};
          reviewsResponse.data.forEach((review) => {
            if (review.attributes.response) {
              initialReplies[review.id] = review.attributes.response;
            }
          });
          setReplyText(initialReplies);
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

  // Обработчик отправки ответа на отзыв
  const handleSubmitReply = async (reviewId: number) => {
    if (!replyText[reviewId]?.trim()) {
      toast.error('Введите текст ответа');
      return;
    }
    
    setSavingReplyId(reviewId);
    
    try {
      // Обновляем отзыв, добавляя ответ специалиста
      await updateReview(reviewId, { 
        response: replyText[reviewId] 
      });
      
      // Обновляем локальное состояние отзывов
      setReviews(reviews.map(review => 
        review.id === reviewId
          ? { 
              ...review, 
              attributes: { 
                ...review.attributes, 
                response: replyText[reviewId] 
              } 
            }
          : review
      ));
      
      toast.success('Ответ успешно добавлен');
    } catch (error) {
      console.error('Ошибка при отправке ответа:', error);
      toast.error('Не удалось сохранить ответ');
    } finally {
      setSavingReplyId(null);
    }
  };

  // Форматирование даты публикации
  const formatPublishedDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
  };

  // Отображение рейтинга звездами
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
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
        <span className="ml-3 text-gray-600">Загрузка отзывов...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Отзывы клиентов</h1>
      
      {reviews.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>У вас пока нет отзывов</CardTitle>
            <CardDescription>
              Отзывы появятся здесь, когда клиенты оставят их после посещения ваших услуг.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-gray-400">
              <MessageSquare className="mr-2 h-10 w-10" />
              <p>Нет отзывов для отображения</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.attributes.user?.name || 'Клиент'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPublishedDate(review.attributes.publishedAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {renderRating(review.attributes.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Услуга:</p>
                    <p className="font-medium">
                      {review.attributes.service?.title || 'Не указана'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="mb-2 text-sm text-gray-600">Отзыв клиента:</p>
                    <div className="rounded-md bg-gray-50 p-4">
                      <p>{review.attributes.content}</p>
                    </div>
                  </div>
                  
                  {review.attributes.response ? (
                    <div>
                      <p className="mb-2 text-sm text-gray-600">Ваш ответ:</p>
                      <div className="rounded-md bg-blue-50 p-4">
                        <p>{review.attributes.response}</p>
                      </div>
                      <div className="mt-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Показываем форму редактирования
                            setReplyText({
                              ...replyText,
                              [review.id]: review.attributes.response || ''
                            });
                          }}
                        >
                          Редактировать ответ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-sm text-gray-600">Ответить на отзыв:</p>
                      <Textarea
                        placeholder="Введите ваш ответ на отзыв клиента..."
                        value={replyText[review.id] || ''}
                        onChange={(e) => 
                          setReplyText({
                            ...replyText,
                            [review.id]: e.target.value
                          })
                        }
                        rows={3}
                        className="mb-2"
                      />
                      <div className="text-right">
                        <Button
                          onClick={() => handleSubmitReply(review.id)}
                          disabled={savingReplyId === review.id}
                        >
                          {savingReplyId === review.id ? 'Сохранение...' : 'Отправить ответ'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 