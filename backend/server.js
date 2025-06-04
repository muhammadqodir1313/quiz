const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quiz_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected successfully');
  connection.release();
});

// Create tables if they don't exist
const createTables = async () => {
  const questionsTable = `
    CREATE TABLE IF NOT EXISTS questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      options JSON NOT NULL,
      correct_answer INT NOT NULL
    )
  `;

  const resultsTable = `
    CREATE TABLE IF NOT EXISTS results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      score INT NOT NULL,
      total_questions INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.promise().query(questionsTable);
    await pool.promise().query(resultsTable);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();

// API Routes
app.get('/api/questions', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM questions');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/results', async (req, res) => {
  const { score, totalQuestions } = req.body;
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO results (score, total_questions) VALUES (?, ?)',
      [score, totalQuestions]
    );
    res.json({ id: result.insertId, score, totalQuestions });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 