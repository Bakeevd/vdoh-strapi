import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold">Вдохновение</h3>
            <p className="mt-4 text-gray-300">
              Пространство для практик йоги, медитации и личностного роста в гармонии с собой и миром.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Навигация</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/specialists" className="text-gray-300 hover:text-white">
                  Специалисты
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Статьи
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Услуги</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services/yoga" className="text-gray-300 hover:text-white">
                  Йога
                </Link>
              </li>
              <li>
                <Link href="/services/meditation" className="text-gray-300 hover:text-white">
                  Медитация
                </Link>
              </li>
              <li>
                <Link href="/services/psychology" className="text-gray-300 hover:text-white">
                  Психологические консультации
                </Link>
              </li>
              <li>
                <Link href="/services/retreats" className="text-gray-300 hover:text-white">
                  Ретриты
                </Link>
              </li>
              <li>
                <Link href="/services/workshops" className="text-gray-300 hover:text-white">
                  Семинары
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Контакты</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-gray-300" />
                <span className="text-gray-300">
                  г. Москва, ул. Примерная, д. 123
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-gray-300" />
                <a href="tel:+74951234567" className="text-gray-300 hover:text-white">
                  +7 (495) 123-45-67
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gray-300" />
                <a
                  href="mailto:info@vdohnovenie.pro"
                  className="text-gray-300 hover:text-white"
                >
                  info@vdohnovenie.pro
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            &copy; {year} Вдохновение. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 