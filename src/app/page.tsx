import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import HeroSection from '@/components/common/HeroSection';
import ServiceCard from '@/components/common/ServiceCard';
import SpecialistCard from '@/components/common/SpecialistCard';
import ArticleCard from '@/components/common/ArticleCard';

// Временные данные для демонстрации
const featuredServices = [
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
];

const featuredSpecialists = [
  {
    id: 1,
    name: 'Елена Иванова',
    bio: 'Сертифицированный инструктор по йоге с 10-летним опытом. Специализируется на хатха и кундалини йоге.',
    role: 'Инструктор по йоге',
    image: '/images/specialist-1.jpg',
  },
  {
    id: 2,
    name: 'Михаил Петров',
    bio: 'Психолог-практик, проводит индивидуальные сессии и групповые медитации. Опыт работы более 15 лет.',
    role: 'Психолог',
    image: '/images/specialist-2.jpg',
  },
];

const featuredArticles = [
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
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      {/* Герой-секция */}
      <HeroSection 
        title="Центр духовных практик «Вдохновение»" 
        subtitle="Пространство для йоги, медитации и личностного роста в гармонии с собой и миром" 
        imageSrc="/images/hero-bg.jpg"
      />
      
      {/* О нас */}
      <section className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">О нашем центре</h2>
            <p className="mt-4 text-lg text-gray-500">
              «Вдохновение» — это уникальное пространство, созданное для тех, кто стремится к гармонии
              души и тела, ищет внутренний покой и новые источники энергии.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Наш центр объединяет опытных мастеров йоги, медитации и специалистов в области психологии,
              которые помогут вам обрести вдохновение и научиться жить в гармонии с собой и миром.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/about">Узнать больше</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-96 overflow-hidden rounded-lg shadow-lg md:h-auto">
            <Image
              src="/images/about-center.jpg"
              alt="Центр Вдохновение"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Услуги */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Наши услуги</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Мы предлагаем широкий спектр услуг для духовного и личностного роста
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/services" className="inline-flex items-center gap-2">
                Все услуги <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Специалисты */}
      <section className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Наши специалисты</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Команда опытных профессионалов, которые помогут вам на пути к гармонии
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredSpecialists.map((specialist) => (
            <SpecialistCard key={specialist.id} {...specialist} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/specialists" className="inline-flex items-center gap-2">
              Все специалисты <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Статьи */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Полезные статьи</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Практические советы и знания для духовного развития и здорового образа жизни
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/blog" className="inline-flex items-center gap-2">
                Все статьи <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Призыв к действию */}
      <section className="container mx-auto py-16">
        <div className="rounded-lg bg-blue-600 px-6 py-16 text-center text-white shadow-lg md:px-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Готовы начать свой путь к гармонии?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Запишитесь на первую консультацию или занятие уже сегодня и получите персональную программу развития
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/booking">Записаться</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700" asChild>
              <Link href="/contact">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
