import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, downloadReport } from '../services/api';

export default function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Admin';

    useEffect(() => {
        fetchAnalytics();
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

    const fetchAnalytics = async () => {
        try {
            const data = await getAnalytics();
            console.log('Analytics data:', data); // Debug log
            setAnalytics(data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                navigate('/login');
            } else {
                setError('Failed to fetch analytics');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (format) => {
        setDownloading(true);
        try {
            const blob = await downloadReport(format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `feedback_report_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            alert('Download failed: ' + (error.response?.data?.detail || error.message));
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <svg className={`animate-spin h-12 w-12 mx-auto ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className={`mt-4 text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p className="font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    const totalFeedbacks = analytics.total_feedbacks || 0;
    const overallRating = analytics.overall_avg_rating || 0;
    const uniqueRatings = analytics.unique_ratings || 0;

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid - 6 Cards in 2 Rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Feedbacks */}
                    <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Total Feedbacks
                        </p>
                        <p className={`mt-2 text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {totalFeedbacks}
                        </p>
                    </div>

                    {/* Overall Rating */}
                    <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Overall Rating
                        </p>
                        <div className="mt-2 flex items-baseline">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                {overallRating > 0 ? overallRating.toFixed(1) : 'N/A'}
                            </p>
                            {overallRating > 0 && <span className="text-lg ml-1">⭐</span>}
                        </div>
                    </div>

                    {/* Unique Ratings */}
                    <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Unique Ratings
                        </p>
                        <div className="mt-2 flex items-baseline">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                                {uniqueRatings}
                            </p>
                            <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ 5</span>
                        </div>
                    </div>

                    {/* 30-Day Average */}
                    <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            30-Day Average
                        </p>
                        <div className="mt-2 flex items-baseline">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {analytics.avg_rating_last_30_days?.toFixed(1) || 'N/A'}
                            </p>
                            {analytics.avg_rating_last_30_days > 0 && <span className="text-lg ml-1">⭐</span>}
                        </div>
                    </div>

                    {/* 60-Day Average */}
                    <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            60-Day Average
                        </p>
                        <div className="mt-2 flex items-baseline">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                {analytics.avg_rating_last_60_days?.toFixed(1) || 'N/A'}
                            </p>
                            {analytics.avg_rating_last_60_days > 0 && <span className="text-lg ml-1">⭐</span>}
                        </div>
                    </div>

                    {/* 90-Day Average */}
                    <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            90-Day Average
                        </p>
                        <div className="mt-2 flex items-baseline">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                {analytics.avg_rating_last_90_days?.toFixed(1) || 'N/A'}
                            </p>
                            {analytics.avg_rating_last_90_days > 0 && <span className="text-lg ml-1">⭐</span>}
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg mb-8`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Rating Distribution
                        </h2>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                            {totalFeedbacks} responses
                        </span>
                    </div>
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = analytics.rating_distribution?.[rating] || 0;
                            const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;

                            const colors = {
                                5: 'bg-green-500',
                                4: 'bg-blue-500',
                                3: 'bg-yellow-500',
                                2: 'bg-orange-500',
                                1: 'bg-red-500'
                            };

                            return (
                                <div key={rating} className="flex items-center gap-4">
                                    <div className="flex items-center w-16">
                                        <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {rating}
                                        </span>
                                        <span className="text-yellow-400 ml-1 text-base">⭐</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'} rounded-full h-6 overflow-hidden`}>
                                            <div
                                                className={`${colors[rating]} h-6 rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {percentage > 15 && (
                                                    <span className="text-xs font-bold text-white">
                                                        {percentage.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-28 text-right">
                                        <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {count}
                                        </span>
                                        <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Export Reports */}
                <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl p-6 shadow-lg`}>
                    <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Export Reports
                    </h2>
                    <p className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Download feedback data
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleDownload('csv')}
                            disabled={downloading}
                            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${darkMode
                                    ? 'bg-green-600 hover:bg-green-500 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                        >
                            <span className="mr-2">📊</span>
                            {downloading ? 'Downloading...' : 'CSV'}
                        </button>
                        <button
                            onClick={() => handleDownload('json')}
                            disabled={downloading}
                            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${darkMode
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            <span className="mr-2">📄</span>
                            {downloading ? 'Downloading...' : 'JSON'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
