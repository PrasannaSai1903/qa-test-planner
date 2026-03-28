# 🧪 QA Test Planner Agent

A premium, AI-powered QA assistant designed to architect high-quality test plans from Jira stories or manual feature descriptions. Built with **React 18**, **Node.js**, **Express**, and integrated with **Ollama**, **OpenAI**, **Groq**, and **Gemini**.

![QA Test Planner](https://img.shields.io/badge/Vercel-Deployed-success)
![LLM-Ready](https://img.shields.io/badge/LLM-Ready-blue)

## ✨ Features

*   **Jira Integration**: Seamlessly fetch story context directly from your Jira board.
*   **Multi-LLM Support**: Supports local models via Ollama or cloud providers (OpenAI, Gemini, Groq, Anthropic).
*   **Manual Feature Input**: If you don't use Jira, generate plans from local file uploads or raw text manually.
*   **Luxury UI/UX**: Premium dashboard with a wizard-driven workflow for generating test suites.
*   **Professional Exports**: Download generated test plans in **DOCX**, **PDF**, or **Markdown** formats.

## 🚀 Getting Started

### 1. Prerequisite (Optional)
If you want to use local models, ensure [Ollama](https://ollama.com/) is installed and running:
```bash
ollama serve
ollama pull llama3 # or your favorite model
```

### 2. Local Setup
```bash
# Install root dependencies
npm install

# Run backend (Port 3001)
cd backend
npm install
npm run dev

# Run frontend (Port 5174)
cd ../frontend
npm install
npm run dev
```

## 🌍 Vercel Deployment

This project is optimized for Vercel!

1. Connect your GitHub repository to Vercel.
2. Ensure the **"Root Directory"** is the project folder.
3. Add the `VITE_API_URL` environment variable if needed.
4. Vercel will build the frontend and deploy the backend as Serverless Functions.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
*   **Backend**: Express, TypeScript, Mammoth, Docx, PDFKit.

---
*Created by Antigravity - Advanced Agentic Coding Assistant*
