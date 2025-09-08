# Strumen.com – Гран-Система-С

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Strumen.com** – разработчик и производитель приборов учета и потребления энергоресурсов в Республике Беларусь. Веб-приложение для управления приборами учета, с авторизацией, базой данных и интеграциями.  

## 🚀 Стек технологий

- **Frontend & Backend:** Next.js  
- **База данных:** PostgreSQL (Prisma ORM)  
- **Интеграции:**  
  - CAPTCHA через Cloudflare  
  - Email уведомления при регистрации и событиях  

## ⚡ Быстрый старт

1. Клонируем репозиторий:  
```bash
git clone https://github.com/ALFARD777/strumen.git
cd strumen
```

2. Устанавливаем зависимости:
```bash
npm install
```

3. Настраиваем переменные окружения в .env:
```bash
DATABASE_URL=postgresql://user:password@host:port/dbname
NEXT_PUBLIC_API_URL=http://localhost:3000
CLOUD_FLARE_KEY=your_cloudflare_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

4. Запускаем локально:
```bash
npm run dev
```

5. Для продакшн сборки:
```bash
npm run build
npm start
```

## 🔧 Функциональность
- Регистрация и авторизация пользователей
- Управление приборами учета через API
- Работа с базой данных через Prisma
- Интеграция с Cloudflare CAPTCHA
- Email уведомления

## Лицензия

Проект лицензирован под [кастомной лицензией](./LICENSE).
Коммерческое использование без разрешения запрещено.