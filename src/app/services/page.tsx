import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import ServiceCard from '@/components/common/ServiceCard';
import { Button } from '@/components/ui/button';

// Временные данные для демонстрации
const services = [
  {
    id: 1,
    title: 'Йога для начинающих',
    description: 'Идеальный старт для тех, кто только знакомится с йогой. Мягкие асаны, правильное дыхание и медитации.',
    price: 1500,
    duration: 60,
    image: '/images/yoga-beginner.jpg',
  },
  {
    id: 2,
    title: 'Медитация осознанности',
    description: 'Практика для снятия стресса и тревожности, помогающая обрести внутренний покой и гармонию.',
    price: 1200,
    duration: 45,
    image: '/images/meditation.jpg',
  },
  {
    id: 3,
    title: 'Индивидуальная консультация',
    description: 'Персональная работа с психологом для решения личных вопросов и осознания своего пути.',
    price: 3500,
    duration: 90,
    image: '/images/counseling.jpg',
  },
  {
    id: 4,
    title: 'Йога для продвинутых',
    description: 'Интенсивная практика для тех, кто уже освоил базовые асаны и хочет углубить свои навыки.',
    price: 1800,
    duration: 75,
    image: '/images/yoga-advanced.jpg',
  },
  {
    id: 5,
    title: 'Групповая медитация',
    description: 'Коллективная практика медитации, усиливающая эффект от занятий благодаря групповой энергии.',
    price: 1000,
    duration: 60,
    image: '/images/group-meditation.jpg',
  },
  {
    id: 6,
    title: 'Ретрит выходного дня',
    description: 'Двухдневная программа погружения в практики йоги, медитации и саморазвития в уединенной обстановке.',
    price: 15000,
    duration: 1440,
    image: '/images/retreat.jpg',
  },
];

// Категории услуг
const categories = [
  { id: 'all', name: 'Все услуги' },
  { id: 'yoga', name: 'Йога' },
  { id: 'meditation', name: 'Медитация' },
  { id: 'psychology', name: 'Психология' },
  { id: 'retreats', name: 'Ретриты' },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Наши услуги</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-500">
          Мы предлагаем разнообразные практики для вашего духовного развития, здоровья и гармонии
        </p>
      </div>

      {/* Фильтры по категориям */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.id === 'all' ? 'default' : 'outline'}
              className="mb-2"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Список услуг */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>

      {/* Призыв к действию */}
      <div className="mt-16 rounded-lg bg-gray-50 p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Не нашли подходящую услугу?
            </h2>
            <p className="mt-4 text-gray-500">
              Свяжитесь с нами для индивидуальной консультации, и мы поможем подобрать программу, 
              которая идеально подойдет именно вам.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  Связаться с нами <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden h-48 overflow-hidden rounded-lg md:block">
            <Image
              src="/images/contact-us.jpg"
              alt="Связаться с нами"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 