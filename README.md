
# 🔊 SpeakEasy - Text to Speech Web App

A sleek, multi-voice, browser-based Text-to-Speech (TTS) web application built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. SpeakEasy allows users to input text, choose from available voices, adjust pitch/rate, and control playback — all within a responsive, accessible UI.

---

## 🌍 Live Demo

👉 [**View**](https://v0-speak-easy-tts-app.vercel.app/)

---

## 🎯 Purpose of the Project

The goal of **SpeakEasy** is to offer a powerful, zero-installation TTS tool for users of all backgrounds:

- 📚 **Support learners** with pronunciation and reading
- 👓 **Assist visually impaired** users in reading digital content
- 🌐 **Preview voice outputs** in different languages and accents
- 📣 **Convert text to voice** for scripts, quotes, or narration

This tool empowers students, educators, creators, and anyone looking to interact with text in a more natural way.

---

## ✨ Features

* 🗣️ **Type and Speak** any text
* 🌍 **Choose from multiple system voices**
* 🎚️ **Adjust Speech Pitch & Rate**
* ⏯️ **Play / Pause / Resume / Stop**
* ⚙️ **Built using modern tools (Next.js, TypeScript, Tailwind)**
* 📱 **Mobile-friendly & Fully Responsive**

---

## 🛠️ Tech Stack

| Layer       | Tools Used                              |
|------------|------------------------------------------|
| **Framework** | Next.js (App Router)                  |
| **Language**  | TypeScript                            |
| **Styling**   | Tailwind CSS, PostCSS                 |
| **TTS Engine**| Web Speech API (built into browsers)  |
| **Package Manager** | pnpm                            |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js** (v18+ recommended)
* **pnpm** (or npm/yarn)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/krushna001m/SpeakEasy-Text-to-Speech.git
   cd SpeakEasy-Text-to-Speech
```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. Visit `http://localhost:3000` in your browser to use the app.

---

## 📁 Project Structure

```plaintext
SpeakEasy-Text-to-Speech/
├── app/                    # Routes and pages (Next.js App Router)
│   └── layout.tsx         # Global layout (providers, theme, etc.)
│   └── page.tsx           # Home route UI
├── components/            # Reusable UI components (VoiceSelector, Controls)
├── hooks/                 # Custom React hooks (e.g. useSpeechSynthesis)
├── lib/                   # Utility functions (e.g. fetch voices)
├── public/                # Static files
├── styles/                # Global styles and Tailwind CSS
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.mjs        # Next.js configuration
├── package.json           # Project metadata and scripts
├── pnpm-lock.yaml         # Lockfile (pnpm)
├── README.md              # Project documentation
```

---

## 📦 Dependencies

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Web Speech API** (native to browser)

---

## 🤝 Contributing

Want to improve the app or add features? Contributions are welcome!

1. Fork the repository

2. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit:

   ```bash
   git commit -m "Add: your feature description"
   ```

4. Push your branch and open a **Pull Request**

---

## 👨‍💻 Author

**Krushna Mengal**
GitHub: [@krushna001m](https://github.com/krushna001m)


