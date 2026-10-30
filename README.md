# CareerHub - Job Portal Application

A modern, full-stack job portal web application connecting job seekers and recruiters through job listings, applications, candidate profiles, and recruitment dashboards.

## 🌟 Features

### For Candidates
- ✅ Search and browse jobs with advanced filters
- ✅ View complete job details
- ✅ Create and manage candidate profile
- ✅ Apply for jobs with cover letters
- ✅ Track application status with visual timeline
- ✅ Save jobs for later
- ✅ View application history

### For Recruiters
- ✅ Create and manage company profile
- ✅ Publish job openings
- ✅ Edit and delete job postings
- ✅ View applicants
- ✅ Review candidate profiles
- ✅ Change application status
- ✅ Monitor recruitment pipeline through dashboard

## 🛠 Technology Stack

### Frontend
- **Next.js 16.4.1** with App Router
- **React 19.3.0**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Lucide React** (icons)
- **React Hook Form** (form management)
- **Zod** (validation)

### Backend
- **Node.js**
- **Next.js API Routes** (REST API)
- **TypeScript**

### Database
- **SQLite** (development)
- **Prisma ORM** (database toolkit)

### Authentication
- **JWT** (JSON Web Tokens)
- **bcryptjs** (password hashing)
- **HTTP-only cookies** (session management)

## 📁 Project Structure

```
career-hub/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── jobs/         # Job management endpoints
│   │   │   ├── applications/ # Application endpoints
│   │   │   └── saved-jobs/   # Saved jobs endpoints
│   │   ├── candidate/        # Candidate pages
│   │   ├── recruiter/        # Recruiter pages
│   │   ├── jobs/             # Job pages
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── navbar/          # Navigation component
│   │   └── footer/          # Footer component
│   ├── lib/                 # Utility libraries
│   │   ├── auth/           # Authentication utilities
│   │   ├── db/             # Database client
│   │   └── validation/     # Zod schemas
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .env.example            # Environment variables template
├── .env                    # Environment variables (local)
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (note: warnings may appear with Node 20.11.1 but the app works)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd career-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
npm run db:push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Schema

### Core Models

- **User**: Base user model with authentication
- **CandidateProfile**: Candidate-specific profile information
- **RecruiterProfile**: Recruiter-specific profile information
- **Company**: Company information
- **Job**: Job postings
- **Application**: Job applications
- **SavedJob**: Bookmarked jobs
- **Skill**: Candidate skills
- **Education**: Candidate education
- **Experience**: Candidate work experience
- **Notification**: User notifications

### Relationships

- User has one CandidateProfile OR RecruiterProfile
- Recruiter belongs to Company
- Company has many Jobs
- Candidate has many Applications
- Job has many Applications
- Candidate has many SavedJobs
- Job has many SavedJobs

## 🔐 Authentication

The application uses JWT-based authentication with HTTP-only cookies:

- **Registration**: `/api/auth/register`
- **Login**: `/api/auth/login`
- **Logout**: `/api/auth/logout`
- **Current User**: `/api/auth/me`

### User Roles

- **CANDIDATE**: Can search jobs, apply, track applications
- **RECRUITER**: Can post jobs, manage applicants
- **ADMIN**: (Optional) Platform administration

## 🧪 Seed Data

The seed script creates:
- 5 companies
- 3 recruiters
- 5 candidates (with skills, education, experience)
- 6 jobs
- 6 applications (with various statuses)
- 3 saved jobs

### Test Accounts

**Candidate:**
- Email: `candidate1@example.com`
- Password: `candidate123`

**Recruiter:**
- Email: `recruiter1@techcorp.com`
- Password: `recruiter123`

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
```

## 🎨 UI Components

The application uses custom UI components built with Tailwind CSS:

- **Button**: Various button styles and sizes
- **Input**: Form input fields
- **Label**: Form labels
- **Card**: Container components

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (recruiter only)
- `GET /api/jobs/recruiter` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Create application (candidate only)
- `GET /api/applications` - Get candidate's applications
- `GET /api/applications/recruiter` - Get recruiter's applications

### Saved Jobs
- `POST /api/saved-jobs` - Save job (candidate only)
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:id` - Remove saved job

## 🎯 Application Status

### ✅ Completed Features
- Project setup and structure
- Database schema with Prisma
- Authentication system (register, login, logout)
- Landing page with hero, search, stats
- Job search with filters and pagination
- Job details page
- Job application system
- Candidate dashboard with application tracking
- Saved jobs functionality
- Recruiter dashboard with statistics
- Seed data with realistic sample data

### 🚧 In Progress
- Job creation and management for recruiters
- Applicant management system
- Recruitment pipeline (Kanban-style)
- Candidate profile management
- Recruiter/company profile management
- File upload system for resumes
- Notification system

### 📋 Planned Features
- Admin panel
- Enhanced error handling
- Loading states
- Mobile responsiveness improvements
- API tests
- Cloud storage integration for resumes

## 🔒 Security

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies for session management
- Role-based access control
- Input validation with Zod
- SQL injection protection through Prisma
- Environment variable configuration

## 📱 Responsive Design

The application is designed to be responsive across:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contributing

This is an internship project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created for educational purposes.

## 🐛 Known Issues

- Node version warnings (app works despite warnings)
- Some features are still in development
- Admin panel not yet implemented

## 📞 Support

For issues or questions, please contact the project maintainers.

---

**Built with ❤️ for CareerHub Internship Project**
