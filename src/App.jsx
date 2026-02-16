import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FeedbackForm from './components/FeedbackForm';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Public Route (redirect to dashboard if logged in)
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;

  // If logged in and trying to access login page, redirect to dashboard
  if (token && currentPath === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);

    // Poll for dark mode changes
    const interval = setInterval(() => {
      const newMode = localStorage.getItem('darkMode') === 'true';
      if (newMode !== darkMode) {
        setDarkMode(newMode);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />

        <Routes>
          {/* Public Feedback Page */}
          <Route
            path="/"
            element={
              <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Welcome to ClientPulse
                  </h1>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    We value your feedback! Help us improve our services.
                  </p>
                </div>
                <FeedbackForm />
              </div>
            }
          />

          {/* Admin Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />

          {/* Admin Dashboard (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className={`text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>404</h1>
                  <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Page not found</p>
                  <a
                    href="/"
                    className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${darkMode
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
