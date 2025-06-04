import React, { useState, useEffect } from 'react';
import './App.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions');
      if (!response.ok) {
        throw new Error('Savollarni yuklashda xatolik yuz berdi');
      }
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
      setLoading(false);
    }
  };

  const handleAnswerClick = async (selectedOption: number) => {
    if (selectedOption === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      // Save result to database
      try {
        await fetch('http://localhost:5000/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score,
            totalQuestions: questions.length,
          }),
        });
      } catch (err) {
        console.error('Natijani saqlashda xatolik:', err);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  if (loading) {
    return <div className="App">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="App">Xatolik: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="App">Savollar topilmadi</div>;
  }

  return (
    <div className="App">
      <div className="quiz-container">
        {showScore ? (
          <div className="score-section">
            <h2>Test yakunlandi!</h2>
            <p>To'g'ri javoblar: {score} / {questions.length}</p>
            <button onClick={resetQuiz}>Qaytadan boshlash</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <h2>Savol {currentQuestion + 1}/{questions.length}</h2>
              <p>{questions[currentQuestion].question}</p>
            </div>
            <div className="answer-section">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
