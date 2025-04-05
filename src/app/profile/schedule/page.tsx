'use client';

import React, { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { useAuth } from '@/context/AuthContext';
import { getSpecialistByUserId, getSpecialistSchedule, updateSpecialistSchedule } from '@/lib/api-services';
import type { StrapiEntity, Specialist, BookingSlot, WorkingHours } from '@/types';

const DAYS_OF_WEEK = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
  '18:00', '18:30', '19:00', '19:30'
];

export default function SchedulePage() {
  const { user, isSpecialist } = useAuth();
  const [specialist, setSpecialist] = useState<StrapiEntity<Specialist> | null>(null);
  const [schedule, setSchedule] = useState<WorkingHours[]>([]);
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Получаем данные специалиста и его расписание
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

        // Получаем расписание специалиста
        const startDate = format(selectedWeek, 'yyyy-MM-dd');
        const endDate = format(addDays(selectedWeek, 6), 'yyyy-MM-dd');
        
        // Получаем расписание
        const scheduleResponse = await getSpecialistSchedule(
          specialistData.id,
          startDate,
          endDate
        );
        
        if (Array.isArray(scheduleResponse)) {
          setSchedule(scheduleResponse as WorkingHours[]);
          
          // Если расписание пустое, создаем стандартное
          if (scheduleResponse.length === 0) {
            const defaultSchedule = createDefaultSchedule(specialistData.id);
            setSchedule(defaultSchedule);
          }
        }
        
        // TODO: Получаем актуальные бронирования
        // const bookingsResponse = await getBookingsForSpecialist(...);
        // setBookings(bookingsResponse);
        
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Не удалось загрузить данные расписания');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isSpecialist, selectedWeek]);

  // Создаем дефолтное расписание
  const createDefaultSchedule = (specialistId: number): WorkingHours[] => {
    return DAYS_OF_WEEK.map((day, index) => {
      // По умолчанию делаем будние дни рабочими
      const isWorkingDay = index < 5;
      
      return {
        specialistId,
        day: format(addDays(selectedWeek, index), 'yyyy-MM-dd'),
        slots: TIME_SLOTS.map(slot => ({
          start: slot,
          end: addTimeMinutes(slot, 30), // Слот длится 30 минут
          available: isWorkingDay
        }))
      };
    });
  };
  
  // Функция для расчета конечного времени слота
  const addTimeMinutes = (timeStr: string, minutes: number): string => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins, 0, 0);
    date.setMinutes(date.getMinutes() + minutes);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Обработчик сохранения расписания
  const handleSaveSchedule = async () => {
    if (!specialist) return;
    
    setSaving(true);
    
    try {
      await updateSpecialistSchedule(specialist.id, { schedule });
      toast.success('Расписание успешно сохранено');
    } catch (error) {
      console.error('Ошибка при сохранении расписания:', error);
      toast.error('Не удалось сохранить расписание');
    } finally {
      setSaving(false);
    }
  };

  // Обработчик изменения доступности слота
  const handleSlotToggle = (dayIndex: number, slotIndex: number) => {
    setSchedule(prev => 
      prev.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              slots: day.slots.map((slot, j) => 
                j === slotIndex 
                  ? { ...slot, available: !slot.available } 
                  : slot
              )
            }
          : day
      )
    );
  };

  // Обработчик изменения доступности всего дня
  const handleDayToggle = (dayIndex: number, available: boolean) => {
    setSchedule(prev => 
      prev.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              slots: day.slots.map(slot => ({ ...slot, available }))
            }
          : day
      )
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
        <span className="ml-3 text-gray-600">Загрузка расписания...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Моё расписание</h1>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Текущая неделя
          </Button>
          
          <Button 
            onClick={handleSaveSchedule} 
            disabled={saving}
            className="whitespace-nowrap"
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Сохранение...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Управление рабочим временем</CardTitle>
          <CardDescription>
            Установите свою доступность для записи клиентов на услуги.
            Отметьте доступные временные слоты.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="weekly">По дням недели</TabsTrigger>
              <TabsTrigger value="calendar">Календарь</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly">
              <div className="space-y-6">
                {schedule.map((day, dayIndex) => {
                  const date = parseISO(day.day);
                  const dateStr = format(date, 'd MMMM (EEEE)', { locale: ru });
                  const allSlotsActive = day.slots.every(slot => slot.available);
                  const noSlotsActive = day.slots.every(slot => !slot.available);
                  
                  return (
                    <div key={day.day} className="rounded-lg border">
                      <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          <h3 className="font-medium">{dateStr}</h3>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id={`day-${dayIndex}`}
                              checked={!noSlotsActive}
                              onCheckedChange={(checked) => handleDayToggle(dayIndex, checked)}
                            />
                            <Label htmlFor={`day-${dayIndex}`}>
                              {noSlotsActive ? 'Выходной' : 'Рабочий день'}
                            </Label>
                          </div>
                          
                          <Select 
                            value={allSlotsActive ? "all" : noSlotsActive ? "none" : "custom"}
                            onValueChange={(value) => {
                              if (value === "all" || value === "none") {
                                handleDayToggle(dayIndex, value === "all");
                              }
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Выберите режим" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Весь день доступен</SelectItem>
                              <SelectItem value="none">Весь день недоступен</SelectItem>
                              <SelectItem value="custom">Выборочно</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {day.slots.map((slot, slotIndex) => {
                          // Проверяем, есть ли бронирование на этот слот
                          const isBooked = bookings.some(booking => 
                            isSameDay(parseISO(booking.date), date) && 
                            booking.time === slot.start
                          );
                          
                          return (
                            <div 
                              key={`${day.day}-${slot.start}`} 
                              className={`
                                flex cursor-pointer items-center justify-between rounded-md border p-2
                                ${isBooked ? 'bg-orange-50 border-orange-200' : 
                                  slot.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                              `}
                              onClick={() => !isBooked && handleSlotToggle(dayIndex, slotIndex)}
                            >
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                <span>{slot.start}</span>
                              </div>
                              
                              {isBooked ? (
                                <span className="text-xs font-medium text-orange-600">Забронировано</span>
                              ) : (
                                <div className={`h-3 w-3 rounded-full ${slot.available ? 'bg-green-500' : 'bg-gray-300'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="rounded-lg border p-4">
                <p className="text-center text-gray-500">
                  Функция календаря будет доступна в ближайшее время
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 