const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? 'https://quiz-tbs5.onrender.com'  // Yangi Render URL manzili
        : 'http://localhost:5000'  // Local development URL
};

export default config; 