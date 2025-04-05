import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/common/ArticleCard';

// Временные данные для демонстрации
const articles = [
  {
    id: 1,
    title: 'Как начать практику медитации дома',
    excerpt: 'В этой статье мы рассмотрим простые шаги для начала домашней практики медитации без специального оборудования и предварительной подготовки.',
    image: '/images/article-1.jpg',
    date: new Date().toISOString(),
    author: {
      name: 'Елена Иванова',
    },
  },
  {
    id: 2,
    title: 'Пять поз йоги для снятия стресса',
    excerpt: 'Изучите пять простых и эффективных асан, которые помогут вам расслабиться и снять накопившееся напряжение всего за 15 минут в день.',
    image: '/images/article-2.jpg',
    date: new Date().toISOString(),
    author: {
      name: 'Михаил Петров',
    },
  },
  {
    id: 3,
    title: 'Правильное питание для поддержания энергии',
    excerpt: 'Узнайте, какие продукты помогут вам поддерживать высокий уровень энергии в течение дня и улучшат общее самочувствие.',
    image: '/images/article-3.jpg',
    date: new Date().toISOString(),
    author: {
      name: 'Ольга Смирнова',
    },
  },
  {
    id: 4,
    title: 'Дыхательные техники для концентрации',
    excerpt: 'Освойте простые дыхательные упражнения, которые помогут улучшить концентрацию внимания и повысить продуктивность.',
    image: '/images/article-4.jpg',
    date: new Date().toISOString(),
    author: {
      name: 'Анна Сидорова',
    },
  },
  {
    id: 5,
    title: 'Аюрведические принципы для здоровой жизни',
    excerpt: 'Познакомьтесь с древними принципами аюрведы, которые можно применить в современной жизни для поддержания баланса и здоровья.',
    image: '/images/article-5.jpg',
    date: new Date().toISOString(),
    author: {
      name: 'Дмитрий Николаев',
    },
  },
  {
    id: 6,
    title: 'Йога для улучшения осанки',
    excerpt: 'Комплекс упражнений йоги, которые помогут исправить осанку, укрепить мышцы спины и избавиться от болей в позвоночнике.',
    image: '/images/article-6.jpg',
    date: new Date().toISOString(),
    author: {
      name: 'Сергей Волков',
    },
  },
];

// Категории статей
const categories = [
  { id: 'all', name: 'Все статьи' },
  { id: 'yoga', name: 'Йога' },
  { id: 'meditation', name: 'Медитация' },
  { id: 'psychology', name: 'Психология' },
  { id: 'nutrition', name: 'Питание' },
  { id: 'ayurveda', name: 'Аюрведа' },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Блог</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-500">
          Полезные статьи, советы и практики для духовного развития и здорового образа жизни
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

      {/* Поиск по блогу */}
      <div className="mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск по статьям..."
            className="w-full rounded-md border border-gray-300 px-4 py-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Список статей */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      {/* Призыв к действию */}
      <div className="mt-16 rounded-lg bg-blue-50 p-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Хотите получать новые статьи?
            </h2>
            <p className="mt-4 text-gray-500">
              Подпишитесь на нашу рассылку, чтобы первыми получать свежие статьи, 
              советы и приглашения на мероприятия.
            </p>
            <div className="mt-6">
              <div className="flex max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button>Подписаться</Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Мы уважаем вашу приватность и никогда не будем делиться вашими данными.
              </p>
            </div>
          </div>
          <div className="relative hidden h-48 overflow-hidden rounded-lg md:block">
            <Image
              src="/images/newsletter.jpg"
              alt="Подписка на рассылку"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 