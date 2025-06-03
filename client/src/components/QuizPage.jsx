import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    // Agar vaqt tugasa, natijani ko'rsatish
    if (timeLeft === 0 && !showResults && !loading) {
        calculateScore();
    }
  }, [timeLeft, showResults, loading]);

  useEffect(() => {
    const answered = Object.keys(selectedAnswers).length;
    const total = questions.length;
    setProgress(total > 0 ? (answered / total) * 100 : 0);
  }, [selectedAnswers, questions]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/quiz');
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Savollarni yuklashda xatolik:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            <div className="w-5 h-5 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-xl font-semibold text-gray-700">Savollar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = (questions.length > 0 ? (score / questions.length) * 100 : 0);
    let resultColor = 'text-red-600';
    let resultMessage = 'Yomon';
    if (percentage >= 80) {
      resultColor = 'text-green-600';
      resultMessage = 'Ajoyib';
    } else if (percentage >= 60) {
      resultColor = 'text-yellow-600';
      resultMessage = 'Yaxshi';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Test yakunlandi!</h2>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4 text-white text-5xl font-bold shadow-xl">
              {score}
            </div>
            <p className={`text-3xl font-bold ${resultColor} mb-2`}>
              {resultMessage}
            </p>
            <p className="text-2xl font-semibold text-gray-700">
              {percentage.toFixed(0)}% to'g'ri
            </p>
            <p className="text-gray-600 mt-2 text-lg">
              {score} ta to'g'ri javob / {questions.length} ta savol
            </p>
          </div>
          <button
            onClick={() => window.location.reload()} // Sahifani yangilash orqali testni qayta boshlash
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg
              hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
          >
            Qayta boshlash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Test</h2>
              <p className="text-gray-600 mt-1">Barcha savollarga javob bering</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 rounded-full h-8 flex items-center px-4 shadow-inner">
                <span className="text-sm font-medium text-gray-700">Vaqt: {formatTime(timeLeft)}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-8 flex items-center px-4 shadow-inner">
                 <span className="text-sm font-medium text-gray-700">Progress: {Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-8">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-start space-x-4 mb-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
                    {qIndex + 1}
                  </span>
                  <div className="flex-grow">
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">{question.question}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {question.answers.map((answer, aIndex) => (
                    <button
                      key={aIndex}
                      onClick={() => handleAnswerSelect(qIndex, answer)}
                      className={`p-4 text-left rounded-lg transition-all duration-200 border
                        ${selectedAnswers[qIndex] === answer
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-700 shadow-lg transform scale-[1.01]'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 hover:shadow-md'
                        }
                        flex items-center space-x-3`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selectedAnswers[qIndex] === answer ? 'border-white' : 'border-gray-400'}`}>
                        {selectedAnswers[qIndex] === answer && (
                          <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                        )}
                      </span>
                      <span className="flex-grow text-base leading-relaxed">{answer}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={calculateScore}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg
                hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
            >
              Natijani ko'rish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 