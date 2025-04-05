import axios from 'axios';

const API_TOKEN = 'f5be85fd54c0d9289b6d88bd64012a9760bea0dcae33a4d203694397fbb5ee3b6c03a1d82d1952108f9be16d52dc990093b07578be506dd1b189e08354b2fc2863b3d0ecc04f50d58905a9bdbceb5a7606802aefff91b5aea65bc10948eeb51294cce73d6b604fd1fffd9bdbda2c11140c31812554250aea042f4d4b4456a7d4';
const API_URL = 'https://pre.vdohnovenie.pro/api';

// Базовый экземпляр axios с дефолтными заголовками и baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

// Добавляем перехватчик для установки токена авторизации пользователя
api.interceptors.request.use((config) => {
  // Получаем токен пользователя из localStorage
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Если токен пользователя существует, используем его вместо токена API
  if (userToken) {
    config.headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  return config;
});

// Перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const {response} = error;
    
    // Обработка ошибок авторизации
    if (response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Редирект на страницу входа
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Функция для получения данных
export const fetchData = async <T>(endpoint: string, params = {}): Promise<T> => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении данных из ${endpoint}:`, error);
    throw error;
  }
};

// Функция для отправки данных
export const postData = async <T>(endpoint: string, data = {}): Promise<T> => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при отправке данных в ${endpoint}:`, error);
    throw error;
  }
};

// Функция для обновления данных
export const updateData = async <T>(endpoint: string, data = {}): Promise<T> => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении данных в ${endpoint}:`, error);
    throw error;
  }
};

// Функция для удаления данных
export const deleteData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении данных из ${endpoint}:`, error);
    throw error;
  }
};

export default api; 