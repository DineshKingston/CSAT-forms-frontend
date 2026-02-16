import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Load dark mode preference
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedMode);

        // Listen for dark mode changes
        const handleStorageChange = () => {
            const newMode = localStorage.getItem('darkMode') === 'true';
            setDarkMode(newMode);
        };
        window.addEventListener('storage', handleStorageChange);

        // Poll for changes (since localStorage events don't fire in same window)
        const interval = setInterval(() => {
            const newMode = localStorage.getItem('darkMode') === 'true';
            if (newMode !== darkMode) {
                setDarkMode(newMode);
            }
        }, 100);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
    };

    return (
        <nav className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg shadow-xl border-b transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className={`text-2xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                ClientPulse
                            </span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`${location.pathname === '/'
                                    ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-gray-900'
                                    : darkMode ? 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all`}
                            >
                                Feedback
                            </Link>
                            {token && (
                                <Link
                                    to="/dashboard"
                                    className={`${location.pathname === '/dashboard'
                                        ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-gray-900'
                                        : darkMode ? 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle - Small */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-all duration-300 ${darkMode
                                    ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'
                                    : 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                                }`}
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {darkMode ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {token ? (
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    👤 {username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${darkMode
                                            ? 'bg-red-600 hover:bg-red-500 text-white'
                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${darkMode
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
