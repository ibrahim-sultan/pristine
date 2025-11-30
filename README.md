# Pristine Education Platform

A full-stack web application for Pristine Education - a remote bootcamp, corporate training, and Olympiad preparation platform.

## Tech Stack

### Frontend (client/)
- React.js 18
- React Router v6
- Axios for API calls
- Custom CSS (no frameworks)

### Backend (server/)
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**

2. **Set up the backend**
```bash
cd server
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - EMAIL_USER/EMAIL_PASS: For email notifications
```

4. **Set up the frontend**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start MongoDB** (if running locally)

2. **Start the backend server**
```bash
cd server
npm run dev
```
Server runs on http://localhost:5000

3. **Start the frontend**
```bash
cd client
npm start
```
Client runs on http://localhost:3000

### Seed Database (Optional)
To populate the database with sample programs and testimonials:
```bash
cd server
node seed/seedData.js
```

This creates:
- 12 sample programs (bootcamps, olympiad tracks, corporate training)
- 5 testimonials
- Admin user: admin@pristineeducation.com / admin123456

## Project Structure

```
Pristine/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       │   ├── Layout/     # Header, Footer, Layout
│       │   └── UI/         # ProgramCard, Modal, etc.
│       ├── context/        # Auth context
│       ├── pages/          # Page components
│       │   └── admin/      # Admin dashboard pages
│       ├── services/       # API service
│       └── styles/         # CSS files
│
├── server/                 # Express backend
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seed/               # Database seeding
│   └── utils/              # Email service
│
└── README.md
```

## Features

### Public Pages
- **Homepage** - Hero, offerings, testimonials
- **Bootcamps** - AI, Data Science, Python, Web Dev, Climate Tech
- **Olympiad Prep** - Programs for ages 6-19
- **Corporate Training** - Digital upskilling for organizations
- **Climate Programs** - Sustainability-focused courses
- **Contact** - Contact form
- **Admissions** - Program catalog and enrollment

### User Authentication
- Registration with role selection
- Login with JWT tokens
- Protected routes

### Admin Dashboard
- Dashboard with statistics
- Programs management
- Enrollment management
- Contact messages

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/programs/featured` - Get featured programs
- `GET /api/programs/category/:category` - Get by category
- `GET /api/programs/:slug` - Get single program

### Enrollments
- `POST /api/enrollments` - Create enrollment
- `GET /api/enrollments` - Get all (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all (admin)

## Brand Colors
- Primary: #003B73 (Deep Blue)
- Secondary: #0FA776 (Emerald Green)
- Accent: #FFC145 (Golden Yellow)

## Deployment (Render)

### Automatic Deployment
This project includes a `render.yaml` for automatic deployment to Render.

1. **Connect GitHub to Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New" → "Blueprint"
   - Connect your GitHub repository

2. **Configure Environment Variables**
   After deployment, set these in Render dashboard:

   **Backend (pristine-api):**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://pristine-frontend.onrender.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=admin@yourdomain.com
   PAYSTACK_PUBLIC_KEY=pk_test_xxx
   PAYSTACK_SECRET_KEY=sk_test_xxx
   STRIPE_PUBLIC_KEY=pk_test_xxx
   STRIPE_SECRET_KEY=sk_test_xxx
   ```

   **Frontend (pristine-frontend):**
   ```
   REACT_APP_API_URL=https://pristine-api.onrender.com/api
   ```

3. **Seed Database (Optional)**
   After backend is deployed, run:
   ```bash
   # In Render Shell for pristine-api
   npm run seed
   ```

### Manual Deployment

#### Backend
1. Create a new "Web Service" on Render
2. Connect your GitHub repo
3. Set Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables

#### Frontend
1. Create a new "Static Site" on Render
2. Connect your GitHub repo
3. Set Root Directory: `client`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `build`
6. Add rewrite rule: `/* → /index.html`

## License
MIT
