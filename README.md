# 🧠 AI Placement Advisor

An AI-powered full-stack web application that helps students prepare for campus placements through personalized guidance, skill gap analysis, learning roadmaps, and mock interviews — all driven by **Google Gemini AI**.

---

## 📸 Features

| Feature | Description |
|---|---|
| **Resume Analyzer** | Upload a PDF resume and get an AI score (0–100) with strengths, weaknesses, and recommendations |
| **Skill Gap Analysis** | Compare your current skills against your target role and get a prioritized gap report |
| **Career Paths** | Discover matching career paths with % match scores, salary ranges, and growth prospects |
| **Learning Roadmap** | Get a personalized multi-phase learning plan with resources — track completion per item |
| **Projects & Certifications** | AI-curated project ideas and certification recommendations tailored to your profile |
| **Mock Interviews** | Answer role-specific questions and get per-answer scoring, feedback, and a final report |
| **Placement Dashboard** | Live readiness score across 5 dimensions with next-step recommendations |

---

## 🛠 Tech Stack

**Frontend** — React 18, Vite, React Router v6, Recharts, Lucide React, Axios, react-hot-toast

**Backend** — Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer (PDF upload), pdf-parse

**AI** — Google Gemini 1.5 Flash (`@google/generative-ai`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

---

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your values:

```bash
cd server
copy .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-placement-advisor
JWT_SECRET=your_random_secret_minimum_32_chars
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run the App

Open **two terminals**:

**Terminal 1 — Server:**
```bash
cd server
npm run dev
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
ai-placement-advisor/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── pages/             # All page components
│       ├── components/        # Layout + common components
│       ├── context/           # AuthContext (JWT)
│       └── services/api.js    # Axios instance
│
└── server/                    # Express backend
    ├── controllers/           # Route handlers
    ├── models/                # Mongoose models
    ├── routes/                # Express routers
    ├── services/ai/           # Gemini AI services
    ├── middleware/            # Auth + file upload
    └── index.js               # Entry point
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET/PUT | `/api/profile` | Get/update profile |
| GET/POST | `/api/resume` | Get/upload/analyze resume |
| GET/POST | `/api/skills` | Get/run skill gap analysis |
| GET/POST | `/api/career` | Get/generate career recommendations |
| GET/POST/PUT | `/api/roadmap` | Get/generate/update roadmap progress |
| GET/POST | `/api/interview` | Interview history, start, answer, complete |
| GET | `/api/projects/recommend` | Project recommendations |
| GET | `/api/projects/certifications` | Certification recommendations |
| GET | `/api/dashboard` | Aggregated dashboard data |

---

## 📝 Notes

- Resume analysis requires a **text-based PDF** (not a scanned image)
- All AI features require a valid **GEMINI_API_KEY**
- The first AI call may be slightly slower as the Gemini model initializes
- Profile must be filled (skills + target role) for best AI recommendations

---

*Minor Project — B.Tech CSE, Chandigarh University, 3rd Semester*
