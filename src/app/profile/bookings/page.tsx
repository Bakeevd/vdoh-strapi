'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { CalendarX, Check, Clock, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getBookingsByUser, updateBooking } from '@/lib/api-services';
import { formatPrice } from '@/lib/utils';
import type { Booking, StrapiEntity } from '@/types';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<StrapiEntity<Booking>[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Загрузка бронирований пользователя
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const response = await getBookingsByUser(user.id);
        setBookings(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
        toast.error('Не удалось загрузить бронирования');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Функция для отмены бронирования
  const handleCancelBooking = async (bookingId: number) => {
    setCancellingId(bookingId);
    
    try {
      await updateBooking(bookingId, { status: 'cancelled' });
      
      // Обновляем список бронирований
      setBookings(bookings.map(booking => 
        booking.id === bookingId
          ? { ...booking, attributes: { ...booking.attributes, status: 'cancelled' } }
          : booking
      ));
      
      toast.success('Бронирование успешно отменено');
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
      toast.error('Не удалось отменить бронирование');
    } finally {
      setCancellingId(null);
    }
  };

  // Функция для форматирования даты и времени
  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    return `${format(date, 'd MMMM yyyy', { locale: ru })}, ${timeStr}`;
  };

  // Статусы бронирования
  const bookingStatusLabels: Record<string, { label: string; className: string }> = {
    pending: { 
      label: 'Ожидает подтверждения', 
      className: 'bg-yellow-100 text-yellow-800' 
    },
    confirmed: { 
      label: 'Подтверждено', 
      className: 'bg-green-100 text-green-800' 
    },
    cancelled: { 
      label: 'Отменено', 
      className: 'bg-red-100 text-red-800' 
    },
    completed: { 
      label: 'Завершено', 
      className: 'bg-blue-100 text-blue-800' 
    },
  };

  // Отображение загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Загрузка бронирований...</span>
      </div>
    );
  }

  // Отображение пустого списка
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarX className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">У вас нет бронирований</h3>
        <p className="mt-1 text-gray-500">Запишитесь на услугу, чтобы она появилась здесь.</p>
        <Button className="mt-4" asChild>
          <a href="/services">Просмотреть услуги</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Мои записи</h1>
      
      <div className="space-y-6">
        {bookings.map((booking) => {
          const {
            date,
            timeSlot,
            status,
            service,
            specialist,
            price
          } = booking.attributes;
          
          // Получаем данные из связанных сущностей
          const serviceName = service.data.attributes.title;
          const specialistName = specialist.data.attributes.user.data.attributes.name;
          const serviceImage = service.data.attributes.image?.data?.attributes?.url;
          
          // Получаем метку статуса
          const statusInfo = bookingStatusLabels[status] || {
            label: 'Неизвестно',
            className: 'bg-gray-100 text-gray-800'
          };
          
          return (
            <div 
              key={booking.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Изображение услуги */}
                <div className="relative h-48 md:h-auto">
                  {serviceImage ? (
                    <img
                      src={serviceImage}
                      alt={serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <span className="text-gray-400">Нет изображения</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:hidden">
                    <h3 className="text-lg font-semibold text-white">{serviceName}</h3>
                  </div>
                </div>
                
                {/* Информация о бронировании */}
                <div className="p-6 md:col-span-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="hidden text-lg font-semibold text-gray-900 md:block">
                        {serviceName}
                      </h3>
                      <p className="text-gray-600">Специалист: {specialistName}</p>
                    </div>
                    
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDateTime(date, timeSlot)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      г. Москва, ул. Примерная, д. 123
                    </div>
                    <div className="flex items-center font-medium">
                      <span>Стоимость: {formatPrice(price)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                    {/* Отображаем кнопку отмены только для будущих бронирований со статусом pending или confirmed */}
                    {(status === 'pending' || status === 'confirmed') && new Date(date) > new Date() && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? 'Отмена...' : 'Отменить запись'}
                      </Button>
                    )}
                    
                    {/* Оставить отзыв можно только после завершения услуги */}
                    {status === 'completed' && (
                      <Button asChild>
                        <a href={`/profile/reviews/create?service=${service.data.id}&specialist=${specialist.data.id}`}>
                          Оставить отзыв
                        </a>
                      </Button>
                    )}
                    
                    {/* Для подтвержденных будущих бронирований показываем кнопку подтверждения */}
                    {status === 'confirmed' && new Date(date) > new Date() && (
                      <div className="flex items-center text-green-600">
                        <Check className="mr-1 h-4 w-4" />
                        <span>Подтверждено</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 