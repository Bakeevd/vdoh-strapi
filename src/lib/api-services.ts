import { 
  StrapiEntitiesResponse, 
  StrapiEntityResponse, 
  Service, 
  Specialist, 
  Article, 
  Review, 
  User, 
  BookingSlot,
  Booking,
  Event,
  Category
} from '@/types';
import { fetchData, postData, updateData, deleteData } from '@/lib/api';

// Сервисы для получения услуг
export const getServices = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Service>>('/services', {
    ...params,
    populate: 'image,specialist,category',
  });
};

export const getService = async (id: number) => {
  return fetchData<StrapiEntityResponse<Service>>(`/services/${id}`, {
    populate: 'image,specialist,specialist.user,specialist.image,category',
  });
};

export const createService = async (data: any) => {
  return postData<StrapiEntityResponse<Service>>('/services', { data });
};

export const updateService = async (id: number, data: any) => {
  return updateData<StrapiEntityResponse<Service>>(`/services/${id}`, { data });
};

export const deleteService = async (id: number) => {
  return deleteData<void>(`/services/${id}`);
};

// Сервисы для получения специалистов
export const getSpecialists = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Specialist>>('/specialists', {
    ...params,
    populate: 'image,user,services',
  });
};

export const getSpecialist = async (id: number) => {
  return fetchData<StrapiEntityResponse<Specialist>>(`/specialists/${id}`, {
    populate: 'image,user,services,services.image',
  });
};

export const getSpecialistByUserId = async (userId: number) => {
  return fetchData<StrapiEntitiesResponse<Specialist>>('/specialists', {
    filters: {
      user: {
        id: {
          $eq: userId,
        },
      },
    },
    populate: 'image,user,services,services.image',
  });
};

export const createSpecialist = async (data: any) => {
  return postData<StrapiEntityResponse<Specialist>>('/specialists', { data });
};

export const updateSpecialist = async (id: number, data: any) => {
  return updateData<StrapiEntityResponse<Specialist>>(`/specialists/${id}`, { data });
};

export const deleteSpecialist = async (id: number) => {
  return deleteData<void>(`/specialists/${id}`);
};

// Сервисы для получения статей
export const getArticles = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Article>>('/articles', {
    ...params,
    populate: 'image,author,author.user,author.image',
  });
};

export const getArticle = async (id: number) => {
  return fetchData<StrapiEntityResponse<Article>>(`/articles/${id}`, {
    populate: 'image,author,author.user,author.image',
  });
};

export const getArticlesBySpecialist = async (specialistId: number) => {
  return fetchData<StrapiEntitiesResponse<Article>>('/articles', {
    filters: {
      author: {
        id: {
          $eq: specialistId,
        },
      },
    },
    populate: 'image,author,author.user,author.image',
  });
};

export const createArticle = async (data: any) => {
  return postData<StrapiEntityResponse<Article>>('/articles', { data });
};

export const updateArticle = async (id: number, data: any) => {
  return updateData<StrapiEntityResponse<Article>>(`/articles/${id}`, { data });
};

export const deleteArticle = async (id: number) => {
  return deleteData<void>(`/articles/${id}`);
};

// Сервисы для получения отзывов
export const getReviews = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Review>>('/reviews', {
    ...params,
    populate: 'user,service,specialist',
  });
};

export const getReview = async (id: number) => {
  return fetchData<StrapiEntityResponse<Review>>(`/reviews/${id}`, {
    populate: 'user,service,specialist',
  });
};

export const getReviewsBySpecialist = async (specialistId: number) => {
  return fetchData<StrapiEntitiesResponse<Review>>('/reviews', {
    filters: {
      specialist: {
        id: {
          $eq: specialistId,
        },
      },
    },
    populate: 'user,service,specialist',
  });
};

export const getReviewsByService = async (serviceId: number) => {
  return fetchData<StrapiEntitiesResponse<Review>>('/reviews', {
    filters: {
      service: {
        id: {
          $eq: serviceId,
        },
      },
    },
    populate: 'user,service,specialist',
  });
};

export const createReview = async (data: any) => {
  return postData<StrapiEntityResponse<Review>>('/reviews', { data });
};

export const updateReview = async (id: number, data: any) => {
  return updateData<StrapiEntityResponse<Review>>(`/reviews/${id}`, { data });
};

export const deleteReview = async (id: number) => {
  return deleteData<void>(`/reviews/${id}`);
};

// Сервисы для бронирования
export const getBookings = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Booking>>('/bookings', {
    ...params,
    populate: 'user,service,specialist',
  });
};

export const getBooking = async (id: number) => {
  return fetchData<StrapiEntityResponse<Booking>>(`/bookings/${id}`, {
    populate: 'user,service,specialist',
  });
};

export const getBookingsByUser = async (userId: number) => {
  return fetchData<StrapiEntitiesResponse<Booking>>('/bookings', {
    filters: {
      user: {
        id: {
          $eq: userId,
        },
      },
    },
    populate: 'user,service,specialist,service.image,specialist.image',
  });
};

export const getBookingsBySpecialist = async (specialistId: number) => {
  return fetchData<StrapiEntitiesResponse<Booking>>('/bookings', {
    filters: {
      specialist: {
        id: {
          $eq: specialistId,
        },
      },
    },
    populate: 'user,service,specialist,user.image',
  });
};

export const createBooking = async (data: any) => {
  return postData<StrapiEntityResponse<Booking>>('/bookings', { data });
};

export const updateBooking = async (id: number, data: any) => {
  return updateData<StrapiEntityResponse<Booking>>(`/bookings/${id}`, { data });
};

export const deleteBooking = async (id: number) => {
  return deleteData<void>(`/bookings/${id}`);
};

// Сервисы для получения категорий
export const getCategories = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Category>>('/categories', params);
};

// Сервисы для профиля пользователя
export const getUserProfile = async () => {
  return fetchData<User>('/users/me', {
    populate: 'role,image',
  });
};

export const updateUserProfile = async (id: number, data: any) => {
  return updateData<User>(`/users/${id}`, data);
};

// Сервисы для управления рабочим временем специалиста
export const getSpecialistSchedule = async (specialistId: number, startDate?: string, endDate?: string) => {
  const params: any = {
    specialistId,
  };
  
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return fetchData<BookingSlot[]>('/specialist-schedules', params);
};

export const updateSpecialistSchedule = async (specialistId: number, data: any) => {
  return updateData<any>(`/specialist-schedules/${specialistId}`, { data });
};

// Сервисы для мероприятий
export const getEvents = async (params = {}) => {
  return fetchData<StrapiEntitiesResponse<Event>>('/events', {
    ...params,
    populate: 'image',
  });
};

export const getEvent = async (id: number) => {
  return fetchData<StrapiEntityResponse<Event>>(`/events/${id}`, {
    populate: 'image',
  });
};

export const createEvent = async (data: any) => {
  return postData<StrapiEntityResponse<Event>>('/events', { data });
};

export const updateEvent = async (id: number, data: any) => {
  return updateData<StrapiEntityResponse<Event>>(`/events/${id}`, { data });
};

export const deleteEvent = async (id: number) => {
  return deleteData<void>(`/events/${id}`);
}; 