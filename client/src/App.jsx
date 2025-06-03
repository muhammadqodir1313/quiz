import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AdminUpload from './components/AdminUpload';
import QuizPage from './components/QuizPage';
import AdminLogin from './components/AdminLogin';

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md"
                >
                  Test
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<QuizPage />} />
            <Route 
              path="/admin" 
              element={
                isAdminAuthenticated ? (
                  <AdminUpload />
                ) : (
                  <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
                )
              }
            />
            {!isAdminAuthenticated && <Route path="/admin/*" element={<Navigate to="/admin" />} />}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 