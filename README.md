# ⚡ ElectraCoach AI

## 🚀 AI Powered Electrical Engineering Interview Coach

ElectraCoach AI is an AI-powered web application that helps Electrical Engineering students and fresh graduates prepare for technical interviews.

The app allows users to ask electrical engineering interview questions and receive AI-generated answers and explanations. It helps students improve their technical knowledge, practice interviews, and build confidence before applying for jobs.

---

# 🎯 Problem Statement

Many Electrical Engineering students struggle to prepare for technical interviews because they don't have access to experienced interviewers or personalized guidance.

ElectraCoach AI solves this problem by providing an AI interview assistant that can answer electrical engineering questions instantly and help students practice anytime.

### Target Users

- Electrical Engineering Students
- Fresh Graduates
- Job Seekers
- Internship Applicants
- Technical Interview Candidates

---

# 🌐 Live Demo

## Live Website

https://ai.studio/apps/b63cea5c-bf0b-4333-a76e-6e84342f40cc

*(Replace this with your deployed Vercel URL.)*

---https://electracoach-ai-pakistan-3.vercel.app/

# ✨ Features

- 🤖 AI-powered interview assistant
- ⚡ Electrical engineering technical questions
- 💬 Instant AI-generated answers
- 📚 Learning-friendly explanations
- 🎯 Interview preparation
- 📱 Responsive design
- 🌐 Web-based application
- ⚡ Fast user interface
- 🧠 Powered by Google Gemini AI

---

# 🤖 AI Feature

The application uses Google's Gemini AI model to generate interview answers for Electrical Engineering topics.

When a user enters a question, the application sends it to the Gemini API, which returns an intelligent and detailed response.

### System Prompt

```
You are an expert Electrical Engineering Interview Coach.

Answer only Electrical Engineering interview questions.

Provide:
- Clear explanation
- Technical concepts
- Practical examples
- Interview tips

If the question is unrelated to Electrical Engineering, politely inform the user that this application only supports Electrical Engineering interview preparation.
```

---

# 🛠 Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes

### AI

- Google Gemini API
- Gemini 2.5 Flash

### Deployment

- Vercel

### Development Tools

- VS Code
- Git
- GitHub

---

# 📸 Screenshots <img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/4ca23630-9c2b-4ba3-95d0-ae6d2295ea03" />


## Home Page

(Add Screenshot Here) <img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/18b2f09a-b139-4791-8453-91092fd5a9e9" />


---

## AI Response

(Add Screenshot Here)<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/e607d312-e421-4a33-a747-0b82f6e4b205" />


---

## Mobile View

(Add Screenshot Here)

---

## Interview Question Example

(Add Screenshot Here)

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/electrical-ai-coach.git
```

Go to project folder

```bash
cd electrical-ai-coach
```

Install dependencies

```bash
npm install
```

Create environment file

```
.env.local
```

Add your API Key

```
GOOGLE_API_KEY=YOUR_API_KEY
```

Run the project

```bash
npm run dev
```

Open browser

```
http://localhost:3000
```

---

# 📂 Project Structure

```
app/
 ├── api/
 │    └── gemini/
 │          └── route.ts
 │
 ├── page.tsx
 │
public/
```

---

# 📌 Future Improvements

- Voice Interview
- Score Evaluation
- Mock Interview Mode
- PDF Interview Notes
- Multiple Engineering Subjects
- User Login
- Interview History
- Dark Mode

---

# 👨‍💻 Author

**Muhammad Hamza**

B.Tech (Hons) Electrical Engineering

---

# 📜 License

This project is developed for educational purposes as part of the **ACT AI Final Project Assignment**.

---

# ⭐ Acknowledgements

- Google Gemini API
- Next.js
- React
- Tailwind CSS
- Vercel
- GitHub
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b63cea5c-bf0b-4333-a76e-6e84342f40cc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
