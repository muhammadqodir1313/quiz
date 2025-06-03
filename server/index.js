import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Fayl yuklash uchun konfiguratsiya
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Fayl yuklash endpointi
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fayl yuklanmadi' });
    }

    const result = await mammoth.extractRawText({ path: req.file.path });
    const text = result.value;

    console.log('Mammothdan olingan matn:', text); // Matnni terminalga yozish

    // Testlarni parse qilish logikasi
    const tests = text.split('+++++').filter(testBlock => testBlock.trim() !== '');

    console.log('+++++ bo\'yicha ajratilgan test bloklari:', tests); // Ajratilgan bloklarni yozish

    const quizData = tests.map(testBlock => {
      const parts = testBlock.split('====').map(part => part.trim()).filter(part => part !== '');
      if (parts.length < 2) return null; // Savol va kamida bitta javob bo'lishi kerak

      const questionMatch = parts[0].match(/Savol\s*(.*)/is);
      const question = questionMatch ? questionMatch[1].trim() : parts[0].trim();

      const answers = parts.slice(1);
      let correctAnswer = null;
      const formattedAnswers = answers.map(answer => {
        if (answer.startsWith('#')) {
          correctAnswer = answer.substring(1).trim();
          return correctAnswer; // To'g'ri javobdan # belgisi olib tashlanadi
        } else {
          return answer;
        }
      });

      const testObject = {
        question: question,
        answers: formattedAnswers,
        correctAnswer: correctAnswer // To'g'ri javob matni saqlanadi
      };

      console.log('Parsed test obyekti:', testObject); // Har bir test obyektini yozish
      return testObject;

    }).filter(test => test !== null);

    console.log('Yakuniy parse qilingan quiz ma\'lumoti:', quizData); // Yakuniy ma'lumotni yozish

    // Parsed testlarni quiz.json fayliga saqlash
    const quizFilePath = path.join(__dirname, 'quiz.json');
    fs.writeFileSync(quizFilePath, JSON.stringify(quizData, null, 2), 'utf8');

    res.json({ message: 'Fayl muvaffaqiyatli yuklandi va testlar saqlandi', quiz: quizData });
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Quiz ma'lumotlarini olish endpointi
app.get('/api/quiz', (req, res) => {
  const quizFilePath = path.join(__dirname, 'quiz.json');
  try {
    const quizDataRaw = fs.readFileSync(quizFilePath, 'utf8');

    if (quizDataRaw.trim() === '') {
      // Agar fayl bo'sh bo'lsa, bo'sh massiv qaytaramiz
      res.json([]);
    } else {
      // Aks holda, parse qilib olamiz
      const allQuestions = JSON.parse(quizDataRaw);

      // Savollarni tasodifiy tanlash
      let selectedQuestions = [];
      const numberOfQuestions = allQuestions.length;
      const questionsToSelect = Math.min(numberOfQuestions, 50); // 50 ta yoki mavjud bo'lganicha

      // Savollar massivini aralashtiramiz (shuffle)
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

      // Birinchi 50 ta (yoki kamroq) savolni tanlaymiz
      selectedQuestions = shuffledQuestions.slice(0, questionsToSelect);

      res.json(selectedQuestions);
    }
  } catch (error) {
    // Fayl topilmasa yoki o'qish/parse qilishda xato bo'lsa
    if (error.code === 'ENOENT') {
      // Fayl topilmasa, bo'sh massiv qaytaramiz
      res.json([]);
    } else {
      // Boshqa xatolik bo'lsa, xatoni terminalga yozamiz va 500 qaytaramiz
      console.error('Quiz ma\'lumotlarini olishda xatolik:', error);
      res.status(500).json({ error: 'Quiz ma\'lumotlarini olishda xatolik' });
    }
  }
});

// Render uchun health check endpointi
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server ${port} portda ishga tushdi`);
}); 