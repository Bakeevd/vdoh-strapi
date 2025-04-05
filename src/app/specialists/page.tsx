import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import SpecialistCard from '@/components/common/SpecialistCard';
import { Button } from '@/components/ui/button';

// Временные данные для демонстрации
const specialists = [
  {
    id: 1,
    name: 'Елена Иванова',
    bio: 'Сертифицированный инструктор по йоге с 10-летним опытом. Специализируется на хатха и кундалини йоге. Проводит индивидуальные и групповые занятия для начинающих и опытных практиков.',
    role: 'Инструктор по йоге',
    image: '/images/specialist-1.jpg',
  },
  {
    id: 2,
    name: 'Михаил Петров',
    bio: 'Психолог-практик, проводит индивидуальные сессии и групповые медитации. Опыт работы более 15 лет. Специализируется на методиках осознанности и управления стрессом.',
    role: 'Психолог',
    image: '/images/specialist-2.jpg',
  },
  {
    id: 3,
    name: 'Анна Сидорова',
    bio: 'Мастер медитации и дыхательных практик. Обучалась в Индии и Тибете у признанных учителей. Помогает освоить различные техники медитации для достижения внутреннего спокойствия.',
    role: 'Мастер медитации',
    image: '/images/specialist-3.jpg',
  },
  {
    id: 4,
    name: 'Дмитрий Николаев',
    bio: 'Терапевт и практик целостного подхода к здоровью. Специализируется на аюрведе и натуропатии. Помогает разработать индивидуальные программы оздоровления и гармонизации.',
    role: 'Аюрведический консультант',
    image: '/images/specialist-4.jpg',
  },
  {
    id: 5,
    name: 'Ольга Смирнова',
    bio: 'Эксперт по здоровому питанию и детоксу. Проводит консультации по правильному питанию и помогает разработать индивидуальные планы питания для поддержания здоровья и энергии.',
    role: 'Нутрициолог',
    image: '/images/specialist-5.jpg',
  },
  {
    id: 6,
    name: 'Сергей Волков',
    bio: 'Преподаватель йоги с фокусом на силовые практики и восстановление. Работает с профессиональными спортсменами и людьми, восстанавливающимися после травм.',
    role: 'Инструктор йоги',
    image: '/images/specialist-6.jpg',
  },
];

// Специализации
const specializations = [
  { id: 'all', name: 'Все специалисты' },
  { id: 'yoga', name: 'Йога' },
  { id: 'psychology', name: 'Психология' },
  { id: 'meditation', name: 'Медитация' },
  { id: 'ayurveda', name: 'Аюрведа' },
];

export default function SpecialistsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Наши специалисты</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-500">
          Команда профессионалов, которые помогут вам на пути к гармонии, здоровью и личностному росту
        </p>
      </div>

      {/* Фильтры по специализациям */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          {specializations.map((specialization) => (
            <Button
              key={specialization.id}
              variant={specialization.id === 'all' ? 'default' : 'outline'}
              className="mb-2"
            >
              {specialization.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Список специалистов */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {specialists.map((specialist) => (
          <SpecialistCard key={specialist.id} {...specialist} />
        ))}
      </div>

      {/* Призыв к действию */}
      <div className="mt-16 rounded-lg bg-blue-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Хотите стать частью нашей команды?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Если вы специалист в области йоги, медитации, психологии или других практик для 
            духовного и физического развития, мы будем рады сотрудничеству.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/contact" className="inline-flex items-center gap-2">
                Присоединиться к команде <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 