import React, { useState } from 'react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  // Bu yerda sizning maxfiy kodingiz bo'ladi. 
  // Haqiqiy loyihada buni .env faylida saqlash tavsiya etiladi.
  const secretCode = 'admin123'; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (code === secretCode) {
      onLoginSuccess();
    } else {
      setError('Noto\'g\'ri kod');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Kirish</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Kodni kiriting"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold
              hover:from-purple-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 