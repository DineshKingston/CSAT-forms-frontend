# ClientPulse Frontend

Customer Satisfaction (CSAT) Feedback Collection System - React Frontend

## 🚀 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Deployment**: EC2 (Static Files via Nginx)

## ✨ Features

- **Public Feedback Form** - Interactive star rating, file uploads, form validation
- **Admin Dashboard** - Analytics with 6 metric cards and rating distribution
- **Dark Mode** - System-wide theme toggle with localStorage persistence
- **JWT Authentication** - Secure admin login
- **Responsive Design** - Mobile-first, works on all devices
- **Protected Routes** - Auth-based navigation
- **Download Reports** - Export data as CSV/Excel

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DineshKingston/clientpulse-frontend.git
cd clientpulse-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
```

4. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

### Option 1: EC2 (Current Setup)

Automated deployment via GitHub Actions:

1. **Push to main branch** → Triggers deployment
2. **Build React app** → Creates optimized bundle
3. **Deploy to EC2** → Uploads to `/var/www/frontend/`

### Manual Deployment to EC2

```bash
# Build
npm run build

# Deploy (replace with your EC2 details)
rsync -avz -e "ssh -i ~/.ssh/your-key.pem" \
  --delete dist/ \
  ubuntu@YOUR_EC2_IP:/var/www/frontend/
```

## 📁 Project Structure

```
clientpulse-frontend/
├── src/
│   ├── components/
│   │   ├── FeedbackForm.jsx   # Public feedback form
│   │   ├── AdminLogin.jsx     # Admin authentication
│   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   └── Navbar.jsx         # Navigation bar
│   ├── services/
│   │   └── api.js             # Axios API client
│   ├── App.jsx                # Main app + routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles + Tailwind
├── .github/
│   └── workflows/
│       └── deploy-ec2.yml     # CI/CD pipeline
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Dependencies
```

## 🎨 Key Components

### FeedbackForm
- Interactive 1-5 star rating buttons
- File upload for screenshots
- Form validation with react-hook-form
- Dark mode support

### Dashboard
- 6 analytics metric cards:
  - Total Feedbacks
  - Overall Average Rating
  - Unique Ratings
  - 30-day Average
  - 60-day Average
  - 90-day Average
- Rating distribution visualization
- Export reports (CSV/Excel)

### AdminLogin
- JWT-based authentication
- Token stored in localStorage
- Redirect to dashboard on success

## 🔐 Authentication Flow

1. Admin logs in → Receives JWT token
2. Token stored in `localStorage`
3. Axios interceptor adds token to all requests
4. Protected routes check for token
5. If missing → Redirect to login

## 🌐 Environment Variables

### Development (`.env`)
```bash
VITE_API_URL=http://localhost:8000
```

### Production (`.env.production`)
```bash
VITE_API_URL=https://clientpulse.duckdns.org
```

## 🎯 Available Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | FeedbackForm | Public |
| `/login` | AdminLogin | Public |
| `/dashboard` | Dashboard | Protected (JWT) |

## 🧪 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```
