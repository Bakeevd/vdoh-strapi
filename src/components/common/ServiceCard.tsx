import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface ServiceCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  price,
  duration,
  image,
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={image || '/images/service-placeholder.jpg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Продолжительность: {duration} мин.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {description}
        </p>
        <p className="mt-4 text-xl font-bold">{formatPrice(price)}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/services/${id}`}>Подробнее</Link>
        </Button>
        <Button>Записаться</Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard; 