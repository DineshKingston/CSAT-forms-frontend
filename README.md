# ClientPulse Frontend

Modern React frontend for ClientPulse CSAT (Customer Satisfaction) feedback system built with Vite, React, Tailwind CSS, and React Hook Form.

## 🚀 Features

- ✅ **Public Feedback Form** - Submit customer feedback with ratings and screenshots
- ✅ **Admin Authentication** - Secure JWT-based login
- ✅ **Analytics Dashboard** - View feedback statistics and rating distribution
- ✅ **Report Downloads** - Export data as CSV or JSON
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Form Validation** - Client-side validation with React Hook Form
- ✅ **Protected Routes** - Secure admin areas

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running at `https://clientpulse.duckdns.org`

## 🛠️ Installation

Dependencies are already installed! If you need to reinstall:

```bash
npm install
```

## ⚙️ Configuration

Environment variables are configured in `.env`:

```env
VITE_API_URL=https://clientpulse.duckdns.org
```

For local development, change to:
```env
VITE_API_URL=http://localhost:8000
```

## 🎯 Quick Start

### Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

### Build for Production

```bash
npm run build
```

Output: `./dist` folder

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FeedbackForm.jsx    # Public feedback submission form
│   ├── AdminLogin.jsx      # Admin authentication page
│   ├── Dashboard.jsx       # Analytics dashboard
│   └── Navbar.jsx          # Navigation bar
├── services/
│   └── api.js              # API service layer (axios)
├── App.jsx                 # Main app with routing
├── main.jsx                # Entry point
└── index.css               # Tailwind CSS + custom styles
```

## 🔗 Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Public feedback form | Public |
| `/login` | Admin login | Public |
| `/dashboard` | Analytics dashboard | Protected (requires JWT) |

## 🎨 Tech Stack

- **Framework**: React 19.2
- **Build Tool**: Vite 7.3
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM 7.13
- **Forms**: React Hook Form 7.71
- **HTTP Client**: Axios 1.13
- **Form Plugin**: @tailwindcss/forms 0.5

## 📡 API Integration

All API calls are configured in `src/services/api.js`:

- `submitFeedback(formData)` - Submit customer feedback
- `adminLogin(credentials)` - Admin authentication
- `getAnalytics()` - Fetch analytics data
- `downloadReport(format)` - Download CSV/JSON reports

## 🔐 Authentication

JWT tokens are stored in localStorage and automatically included in API requests via axios interceptors.

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Option 3: EC2 (Same Server)

```bash
npm run build
scp -r dist/* ubuntu@YOUR_EC2:/var/www/clientpulse-frontend
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing

### Test Feedback Submission
1. Go to http://localhost:5173
2. Fill out the feedback form
3. Submit and verify success message

### Test Admin Login
1. Go to http://localhost:5173/login
2. Use your admin credentials
3. Verify redirect to dashboard

### Test Dashboard
1. Login as admin
2. View analytics and rating distribution
3. Test CSV and JSON downloads

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your custom color palette
  }
}
```

### Add New Components

```bash
# Create component
touch src/components/YourComponent.jsx

# Import in App.jsx
import YourComponent from './components/YourComponent';
```

## 🐛 Troubleshooting

### CORS Errors

Make sure backend CORS is configured to allow:
```python
CORS_ORIGINS=["http://localhost:5173", "https://yourdomain.com"]
```

### API Connection Failed

Check `.env` file has correct API URL and backend is running.

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```