// Типы для работы со Strapi API

export interface StrapiResponse<T> {
  data: StrapiEntity<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>;
  meta: {};
}

export type StrapiEntityResponse<T> = StrapiResponse<StrapiEntity<T>>;
export type StrapiEntitiesResponse<T> = StrapiResponse<StrapiEntity<T>[]>;

export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: {
        thumbnail: {
          url: string;
          width: number;
          height: number;
        };
        small: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        large: {
          url: string;
          width: number;
          height: number;
        };
      };
      url: string;
    };
  };
}

// Пользователь
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: Media;
  isSpecialist?: boolean;
  role?: {
    id: number;
    name: string;
    type: string;
  };
}

// Специалист
export interface Specialist {
  name: string;
  bio: string;
  role: string;
  userId: number;
  user?: User;
  image?: Media;
  schedule?: WorkingHours[];
  services?: Service[];
  articles?: Article[];
  reviews?: Review[];
  isAvailable: boolean;
  specializations: string[];
  rating: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Услуга
export interface Service {
  title: string;
  description: string;
  price: number;
  duration: number;
  specialists: Specialist[];
  category: Category;
  isAvailable: boolean;
  image?: Media;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Статья
export interface Article {
  title: string;
  content: string;
  excerpt: string;
  author: Specialist;
  category: Category;
  image?: Media;
  slug: string;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Событие
export interface Event {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  image?: Media;
  participants?: User[];
  organizer: Specialist;
  isAvailable: boolean;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Бронирование
export interface Booking {
  service: Service;
  specialist: Specialist;
  user: User;
  date: string;
  time: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Слот бронирования
export interface BookingSlot {
  id: number;
  specialist: Specialist;
  service: Service;
  date: string;
  time: string;
  duration: number;
  available: boolean;
}

// Рабочее время специалиста
export interface WorkingHours {
  specialistId: number;
  day: string;
  slots: TimeSlot[];
}

// Временной слот
export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Отзыв
export interface Review {
  content: string;
  rating: number;
  user: User;
  specialist?: Specialist;
  service?: Service;
  booking?: Booking;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Категория
export interface Category {
  name: string;
  description?: string;
  slug: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

// Избранное
export interface Favorite {
  user: User;
  specialists?: Specialist[];
  services?: Service[];
  articles?: Article[];
  createdAt: string;
  updatedAt: string;
}

// Медиа
export interface Media {
  name: string;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

export interface MediaFormat {
  name: string;
  url: string;
  mime: string;
  size: number;
  width: number;
  height: number;
}

// Уведомление
export interface Notification {
  user: User;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

// Настройки уведомлений
export interface NotificationPreference {
  user: User;
  email: boolean;
  push: boolean;
  sms: boolean;
  bookings: boolean;
  reviews: boolean;
  articles: boolean;
  promotions: boolean;
  createdAt: string;
  updatedAt: string;
}

// Контактная информация
export interface Contact {
  type: 'phone' | 'email' | 'address' | 'social';
  value: string;
  label?: string;
  icon?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Дополнительные типы для форм и запросов
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
} 