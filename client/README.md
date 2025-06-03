# Quiz Platform

Bu loyiha test fayllarini yuklash va foydalanuvchilarga test topshirish imkonini beruvchi platforma.

## O'rnatish

1. Loyihani klonlang:
```bash
git clone <repository-url>
cd quiz-platform
```

2. Barcha kerakli paketlarni o'rnating:
```bash
npm run install-all
```

## Ishga tushirish

1. Server va client ni ishga tushiring:
```bash
npm start
```

Bu buyruq server va client ni parallel ravishda ishga tushiradi:
- Server: http://localhost:5000
- Client: http://localhost:5173

## Funksionallik

### Admin Panel
- `/admin` manzilida test fayllarini (.docx) yuklash imkoniyati
- Yuklangan fayllar avtomatik ravishda parse qilinadi va quiz.json fayliga saqlanadi

### Test
- Asosiy sahifada foydalanuvchilar test topshirishlari mumkin
- Har bir savol uchun bir nechta javob variantlari
- Test yakunlanganda natija ko'rsatiladi

## Texnologiyalar

- Frontend: React, TailwindCSS
- Backend: Node.js, Express
- Fayl yuklash: Multer
- .docx parse qilish: Mammoth 