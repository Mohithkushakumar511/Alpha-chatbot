# Alpha Chatbot 🤖⚡

Alpha is an advanced, futuristic AI companion and chatbot combining a sleek 3D interactive robot interface with ultra-low latency AI inference powered by the **Groq API** and a robust **FastAPI** asynchronous backend.

---

## 🌟 Overview

**Alpha Chatbot** delivers an immersive and intelligent conversational experience. Featuring a reactive 3D robot companion rendered with Three.js and styled with modern glassmorphism aesthetics, Alpha offers tailored conversation modes (Chat, Code, Create, Search, Learn), web search integration, and voice synthesis support.

---

## ✨ Features

- **Interactive 3D Robot Companion**: Fully animated 3D robot built with Three.js, reacting with smooth animations to idle, thinking, and speaking states.
- **Ultra-Fast AI Inference**: Powered by the **Groq API** for near-instant responses with state-of-the-art open-source LLMs.
- **Specialized Operational Modes**:
  - 💬 **Chat Mode**: Natural, engaging, and articulate conversation.
  - 💻 **Code Mode**: Clean, modular code, algorithmic breakdowns, and debugging tips.
  - 🎨 **Create Mode**: Brainstorming, ideation, and creative writing.
  - 🔍 **Search Mode**: Synthesized answers powered by live search queries.
  - 🎓 **Learn Mode**: Intuitive step-by-step explanations and real-world analogies.
- **Voice Synthesis**: Integrated audio output via **Fish Audio API** with automatic fallback to the browser's native Web Speech synthesis.
- **Real-Time API Status Bar**: Live health and status indicators for backend connectivity and external services.
- **Rich Markdown & Code Rendering**: GitHub-flavored markdown with fenced code formatting for clear technical responses.
- **Futuristic UI**: Built with React 19, Tailwind CSS v4, and Framer Motion.

---

## 🛠️ Technologies Used

### Frontend
- **React 19** & **TypeScript**
- **Vite** (Build tool & development server)
- **Three.js** (3D robot rendering & animations)
- **Tailwind CSS v4** (Modern styling & cybernetic aesthetic)
- **Framer Motion** (Smooth UI transitions and micro-interactions)
- **Lucide React** (Modern iconography)
- **React Markdown & Remark GFM** (Markdown parsing and rendering)

### Backend
- **Python 3.10+**
- **FastAPI** (High-performance asynchronous REST API)
- **Uvicorn** (Lightning-fast ASGI server)
- **Groq Python SDK** (`groq` for high-throughput LLM inference)
- **HTTPX** (Asynchronous HTTP requests)
- **Python Dotenv** (Secure environment configuration management)

---

## 📂 Project Structure

```
alpha/
├── server/                     # FastAPI backend application
│   ├── routes/                 # API endpoints (chat, status, voice)
│   │   ├── chat.py
│   │   ├── status.py
│   │   └── voice.py
│   ├── services/               # Core services & integrations
│   │   ├── groq_service.py     # Groq API client & prompt engineering
│   │   ├── search_service.py   # Web search integration
│   │   └── voice_service.py    # Voice synthesis engine
│   ├── config.py               # Environment configuration loader
│   └── main.py                 # FastAPI application & lifespan setup
├── src/                        # React frontend application
│   ├── components/             # Reusable UI & 3D robot components
│   │   ├── ApiStatusBar.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatHistory.tsx
│   │   ├── ChatModeTabs.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── FeatureCards.tsx
│   │   ├── FloatingRobot.tsx
│   │   ├── HeroSection.tsx
│   │   ├── IntegrationModal.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── MessageList.tsx
│   │   ├── Navbar.tsx
│   │   └── Robot3D.tsx
│   ├── App.tsx                 # Main layout & chat orchestration
│   ├── index.css               # Global stylesheet & Tailwind directives
│   ├── main.tsx                # Frontend entry point
│   └── types.ts                # TypeScript type definitions
├── .env.example                # Example environment variables template
├── .gitignore                  # Git ignore rules for secrets & build files
├── index.html                  # HTML entry point
├── main.py                     # Root FastAPI entry point
├── package.json                # Node dependencies & npm scripts
├── requirements.txt            # Python dependencies
├── run.bat                     # Windows one-click startup script
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Installation Instructions

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **Python** (v3.10 or higher recommended)
- A **Groq API Key** (Get one for free at [console.groq.com](https://console.groq.com))

---

### 1. Clone the Repository

```bash
git clone https://github.com/Mohithkushakumar511/Alpha-Chatbot.git
cd Alpha-Chatbot
```

### 2. Set Up the Python Virtual Environment & Install Dependencies

```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
.venv\Scripts\activate.bat
# On macOS/Linux:
source .venv/bin/activate

# Install Python backend dependencies
pip install -r requirements.txt
```

### 3. Install Node.js Frontend Dependencies

```bash
npm install
```

---

## 🔑 Environment Configuration

1. Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt: `copy .env.example .env`)*

2. Open `.env` in your text editor and add your **Groq API Key**:
   ```env
   # Groq API Configuration (Required)
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   AI_MODEL=openai/gpt-oss-120b

   # Backend Server Port
   SERVER_PORT=3001

   # Optional: Voice Engine (Fish Audio)
   FISH_AUDIO_API_KEY=
   FISH_AUDIO_VOICE_ID=
   FISH_AUDIO_MODEL=s2.1-pro-free

   # Optional: Web Search Engine (LangSearch)
   LANGSEARCH_API_KEY=
   ```

> [!IMPORTANT]
> Never commit your `.env` file to version control. The `.gitignore` file is configured to prevent your secrets from being pushed to GitHub.

---

## 🏃 Running the Application

### Option A: One-Click Startup (Windows)
Double-click `run.bat` or run in terminal:
```cmd
run.bat
```
This automatically starts both the FastAPI backend and the Vite frontend simultaneously.

---

### Option B: Running Concurrently via NPM
```bash
npm run dev
```
This command runs both the FastAPI backend on port `3001` and Vite dev server on port `5173`.

---

### Option C: Running Frontend & Backend Separately

**1. Start the FastAPI Backend:**
```bash
# Activate your virtual environment first
python -m uvicorn server.main:app --host 127.0.0.1 --port 3001 --reload
```
The API server will run at `http://localhost:3001`. You can access the interactive API docs at `http://localhost:3001/docs`.

**2. Start the Frontend:**
```bash
npm run client
# or: npx vite --open
```
The frontend interface will open at `http://localhost:5173`.

---

## 🛡️ Security & Privacy

- All API keys are loaded dynamically from environment variables and never exposed to the client.
- Sensitive files (`.env`, `.env.*`, virtual environments, logs) are explicitly excluded via `.gitignore`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
