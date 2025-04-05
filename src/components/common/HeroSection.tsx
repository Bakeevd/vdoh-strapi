import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Центр духовных практик «Вдохновение»',
  subtitle = 'Пространство для йоги, медитации и личностного роста в гармонии с собой и миром',
  imageSrc = '/images/hero-bg.jpg',
}) => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="Вдохновение фон"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[70vh] flex-col items-start justify-center py-20">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-gray-500">
            {subtitle}
          </p>
          <div className="mt-10 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/services">Наши услуги</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/specialists">Специалисты</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 