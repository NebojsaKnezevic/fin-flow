# 🚀 FinFlow App

**FinFlow** is a modern personal finance tracking application designed to make expense logging **fast, effortless, and smart**. By leveraging AI, FinFlow allows users to capture receipts, dictate expenses, or type short logs—automatically converting raw input into structured financial data.

> **Core Philosophy:** Minimal friction for input. Gathering data should take seconds, whether through a camera shot, a voice note, or text.

---

## 🛠️ Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/)
- **Mobile Frontend:** [Expo](https://expo.dev/) (React Native) + TypeScript
- **Backend API:** Node.js / Express / TypeScript
- **Database:** PostgreSQL
- **AI Engine:** Multimodal AI (Gemini / GPT-4o / Claude Vision) via API

---

## 📋 Features & User Stories

### US-00 — User Authentication

> As a user, I want to create an account and log in so that my financial data is securely stored.

- **AC:** Register with email and password.
- **AC:** Persistent session login.
- **AC:** Secure/protected routes for dashboard and logging views.

### US-01 — Manual Input (Fallback)

> As a user, I want to manually enter expense details via a form as a fallback method.

- **AC:** Standard form fields (Amount, Category, Date, Note).

### US-02 — Multimodal AI Assistant (Text / Camera / Voice)

> As a user, I want AI-assisted expense logging through photos, voice, or quick text prompts so that I can capture transactions effortlessly.

- **AC:** **Camera:** Upload or snap a receipt photo to automatically extract vendor, total, date, and items.
- **AC:** **Voice/Text:** Dictate or type short phrases (e.g., _"Coffee for 3$ at Starbucks"_).
- **AC:** AI auto-categorizes expenses and suggests new category creation if needed.
- **AC:** **Human-in-the-loop:** All extracted data is presented to the user for ratification/editing before saving to the database.

### US-03 — Expense Timeline & Analytics

> As a user, I want to filter and aggregate my spending patterns over different timeframes.

- **AC:** Views for Daily, Weekly, Monthly, Quarterly, and Yearly trends.

### US-04 — Smart Budget Alerts

> As a user, I want to set spending limits per category and receive timely notifications.

- **AC:** Configurable limits per category.
- **AC:** Automated push notifications at 80% and 100% budget utilization (works in background).

### US-05 — Dashboard Overview

> As a user, I want a clean home screen displaying an instant financial summary.

- **AC:** Total monthly spend vs. set budget.
- **AC:** Top 3 spending categories breakdown.
- **AC:** Feed of recent transactions.
