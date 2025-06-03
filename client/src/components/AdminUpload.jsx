import React, { useState } from 'react';
import axios from 'axios';

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('Faqat .docx formatidagi fayllarni yuklashingiz mumkin');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Iltimos, fayl tanlang');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData);
      setMessage('Fayl muvaffaqiyatli yuklandi');
      setFile(null);
      e.target.reset();
    } catch (error) {
      setMessage('Xatolik yuz berdi: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Test Faylini Yuklash</h2>
          <p className="mt-2 text-sm text-gray-600">Faqat .docx formatidagi fayllarni yuklashingiz mumkin</p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-left">
                .docx fayl tanlang
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all duration-200
                  ${dragActive 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className={`mx-auto h-12 w-12 transition-colors duration-200 ${
                      dragActive ? 'text-purple-500' : 'text-gray-400'
                    }`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Fayl tanlang</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">yoki faylni bu yerga tashlang</p>
                  </div>
                  <p className="text-xs text-gray-500">DOCX formatida</p>
                </div>
              </div>
              {file && (
                <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{file.name}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!file || isUploading}
              className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white
                ${!file || isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yuklanmoqda...
                </div>
              ) : (
                'Yuklash'
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-medium transform transition-all duration-300 ${
              message.includes('muvaffaqiyatli')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpload; 