'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Edit, Plus, Search, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useAuth } from '@/context/AuthContext';
import { getServices, deleteService } from '@/lib/api-services';
import { formatPrice } from '@/lib/utils';
import type { StrapiEntity, Service } from '@/types';

export default function AdminServicesPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<StrapiEntity<Service>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Проверяем, авторизован ли пользователь как админ
  useEffect(() => {
    if (user && !isAdmin()) {
      router.push('/profile');
    }
  }, [user, isAdmin, router]);

  // Загрузка услуг
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        if (Array.isArray(response.data)) {
          setServices(response.data as StrapiEntity<Service>[]);
        } else {
          console.error('Неверный формат данных:', response);
          toast.error('Ошибка при получении данных');
        }
      } catch (error) {
        console.error('Ошибка при загрузке услуг:', error);
        toast.error('Не удалось загрузить список услуг');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Обработчик удаления услуги
  const handleDeleteService = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      setDeletingId(id);
      
      try {
        await deleteService(id);
        setServices(services.filter(service => service.id !== id));
        toast.success('Услуга успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
        toast.error('Не удалось удалить услугу');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Фильтрация услуг по поисковому запросу
  const filteredServices = services.filter(service => 
    service.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold">Управление услугами</h1>
        
        <Button onClick={() => router.push('/profile/admin/services/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить услугу
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Услуги</CardTitle>
          <CardDescription>
            Просмотр и управление услугами, доступными для клиентов.
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск услуг..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Услуги не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service, index) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{service.attributes.title}</TableCell>
                      <TableCell>{formatPrice(service.attributes.price)}</TableCell>
                      <TableCell>{service.attributes.duration} мин.</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            service.attributes.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {service.attributes.isAvailable ? 'Активна' : 'Отключена'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/profile/admin/services/${service.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            disabled={deletingId === service.id}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 