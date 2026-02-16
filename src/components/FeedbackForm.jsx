import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { submitFeedback } from '../services/api';

export default function FeedbackForm() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [darkMode, setDarkMode] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);

    useEffect(() => {
        //Load dark mode preference
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

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('rating', selectedRating); // Use selectedRating state
        if (data.description) formData.append('description', data.description);
        if (data.screenshot && data.screenshot[0]) {
            formData.append('screenshot', data.screenshot[0]);
        }

        try {
            await submitFeedback(formData);
            setMessage({
                type: 'success',
                text: '🎉 Thank you for your feedback!',
            });
            reset();
            setSelectedRating(null); // Reset rating
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.detail || 'Failed to submit feedback. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
        setValue('rating', rating); // Update form value
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border rounded-xl shadow-lg max-w-2xl mx-auto p-8`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Share Your Feedback
            </h2>

            {message.text && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                    ? darkMode ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-50 text-green-700 border border-green-200'
                    : darkMode ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50'
                            } focus:ring-2 focus:outline-none`}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50'
                            } focus:ring-2 focus:outline-none`}
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Rating - Interactive Star Buttons */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Rating *
                    </label>
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleRatingClick(rating)}
                                onMouseEnter={() => setHoverRating(rating)}
                                onMouseLeave={() => setHoverRating(null)}
                                className={`px-4 py-2 rounded-lg border-2 font-semibold text-lg transition-all duration-200 ${selectedRating === rating
                                    ? darkMode
                                        ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                                        : 'border-blue-500 bg-blue-50 text-blue-700'
                                    : (hoverRating && rating <= hoverRating)
                                        ? darkMode
                                            ? 'border-blue-400/60 bg-blue-500/10 text-blue-400'
                                            : 'border-blue-400 bg-blue-50/50 text-blue-600'
                                        : darkMode
                                            ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                    }`}
                                title={`${rating} Star${rating > 1 ? 's' : ''}`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                    {/* Hidden input for validation */}
                    <input
                        type="hidden"
                        {...register('rating', {
                            required: 'Please select a rating',
                            validate: () => selectedRating !== null || 'Please select a rating'
                        })}
                        value={selectedRating || ''}
                    />
                    {errors.rating && (
                        <p className="mt-2 text-sm text-red-500 text-center">{errors.rating.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows="4"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50'
                            } focus:ring-2 focus:outline-none`}
                        placeholder="Tell us more about your experience..."
                    />
                </div>

                {/* Screenshot */}
                <div>
                    <label htmlFor="screenshot" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Screenshot (optional)
                    </label>
                    <input
                        type="file"
                        id="screenshot"
                        {...register('screenshot')}
                        accept="image/*"
                        className={`block w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'
                            } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${darkMode
                                ? 'file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30'
                                : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                            }`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${darkMode
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}
