import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UserIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, truncateText } from '@/lib/utils';

interface ArticleCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: {
    name: string;
    image?: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  image,
  date,
  author,
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={image || '/images/article-placeholder.jpg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            <span>{author.name}</span>
          </div>
        </div>
        <CardTitle className="mt-2 line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {truncateText(excerpt, 150)}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/blog/${id}`}>Читать далее</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard; 