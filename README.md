
## Badges


![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&style=flat-square)
![OpenRouter](https://img.shields.io/badge/AI%20API-OpenRouter-blueviolet?logo=openai&style=flat-square)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js&style=flat-square)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8?logo=tailwindcss&style=flat-square)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript&style=flat-square)

## 🖥️ Demo

🔗 [Live App on Vercel](https://ai-powered-healthcare-qa-agent-dkg5.vercel.app/)

---
# 🩺 AI-Powered Healthcare Document QA Agent

An intelligent web application that enables users to upload healthcare-related PDF documents (e.g., insurance forms, policies, claims), ask natural language questions, and receive accurate, real-time answers using AI. Built with cutting-edge frontend and backend technologies and deployed seamlessly on Vercel.


## 📌 Agenda

To reduce complexity and confusion in understanding healthcare documents by allowing users to interactively query forms and get clear, natural language explanations powered by LLMs.


## ❓ Problem Statement

Healthcare documents are notoriously difficult to interpret due to legal and technical jargon. Patients and non-experts often find it overwhelming to understand terms like **deductibles**, **co-payments**, or **eligibility clauses**.

> **Goal:** Build a tool where a user can upload a healthcare PDF form and ask questions like:
> - “What is the deductible amount?”
> - “Does this plan cover maternity?”
> - “What are the pre-existing conditions?”


## ✅ Solution

A full-stack application that:
- Accepts PDF documents from users
- Extracts text using `pdf-parse`
- Accepts voice/text input from users
- Streams AI-generated answers using **OpenRouter** and **Mistral-7B Instruct**
- Displays results in real-time with history tracking
- Allows exporting chat history as a PDF


##  🛠️ Technologies Used
### Frontend
- **Next.js 15 App Router**
- **TypeScript**
- **Tailwind CSS + Shadcn/UI**
- **Vercel (for deployment)**
- **Voice-to-text API (Web Speech API)**
- **jsPDF** for PDF download

### Backend
- **API Routes (Next.js App Router)**
- **Streaming OpenAI-compatible APIs via OpenRouter**
- **PDF parsing via `pdf-parse`**

##  🛍️ Features

- 📄 Upload and parse healthcare PDF forms
- 🎤 Voice-based question input
- 🤖 Ask free-form natural language questions
- ⚡ Live streaming answers (no loading delay)
- 🧠 Answer history with download as PDF
- 🌙 Light/Dark mode toggle
- 📱 Mobile-responsive UI
##   🗂️  Project Structure

```bash
ai-healthcare-qa-app/
├── public/
│   └── favicon.ico                  # Tab icon for browser
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ask/route.ts         # Serverless route: Sends streamed prompt to OpenRouter
│   │   │   └── upload/route.ts      # Serverless route: Uploads and parses PDF file content
│   │   ├── page.tsx                 # Main UI page: handles form, Q&A, streaming response
│   │   ├── layout.tsx               # App-wide layout wrapper
│   │   ├── globals.css              # Global styles
│   │   └── providers.tsx            # Theme provider (for light/dark toggle)
│
│   ├── components/                  # UI elements (Button, Input, etc. via Shadcn)
│
│   └── types/
│       └── pdf-parse.d.ts           # Type declaration for `pdf-parse/lib/pdf-parse`
│
├── .env.local                       # Environment variables (e.g. OpenRouter API key)
├── package.json                     # Dependencies and build scripts
├── next.config.mjs                  # Next.js config
├── tsconfig.json                    # TypeScript settings
└── README.md                        # You’ll create this (project overview)

```
## 🚀 Getting Started

### 1. Clone this repo
```bash
git clone https://github.com/amruthadevops/AI-powered-Healthcare-QA-Agent.git
cd AI-powered-Healthcare-QA-Agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run locally
```bash
npm run dev
```

## 🔒 Security Notes

- Only public LLM APIs (via OpenRouter) are used.

- No private medical information is stored or logged.

- You can add authentication via Clerk or Auth.js if needed.


## 💡 Future Enhancements

- RAG-based retrieval with vector database

- Support for uploading multiple files

- User login/auth & saved sessions

- Export answers to Excel

- Multi-language support
## 📄 License

MIT License. Feel free to fork, remix, and improve.

## 📬 Contact

Amrutha C

[LinkedIn](https://www.linkedin.com/in/c-amrutha/)

