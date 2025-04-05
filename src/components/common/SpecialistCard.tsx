import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { truncateText } from '@/lib/utils';

interface SpecialistCardProps {
  id: number;
  name: string;
  bio: string;
  role: string;
  image: string;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({
  id,
  name,
  bio,
  role,
  image,
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-64 w-full">
        <Image
          src={image || '/images/specialist-placeholder.jpg'}
          alt={name}
          fill
          className="object-cover object-top"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {role}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {truncateText(bio, 120)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/specialists/${id}`}>Подробнее</Link>
        </Button>
        <Button asChild variant="accent">
          <Link href={`/booking?specialist=${id}`}>Записаться</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpecialistCard; 