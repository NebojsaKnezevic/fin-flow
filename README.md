# FinFlow App

This application is supposed to allow easy fin data gathering, primarily by taking pictures of the eceipts. Dissecting the data via some AI API and producing 1 unified JSON object for further analysis. Afterwards, it allows for tracking of the expenses on daily, weekly, monthly, quarterly, and yearly terms. Also, it may have the ability to notify the user if he spends too much money or less per specific period. This would allow users to better plan their budget.

**The most important part is to make super easy, fast and convinient information gathering.**

---

## Tech Stack

- **Monorepo Management:** Turborepo
- **Mobile:** Expo (React Native) / TypeScript
- **Backend:** Node.js / Express / TypeScript
- **Database:** PostgreSQL
- **AI Integration:** (TBD — Claude / GPT / Gemini)

---

## User Stories

### US-00 — User Authentication

As a user, I want to create an account and log in so that my financial data is securely stored.

- **AC:** User can register with an email and password.
- **AC:** User can log in to persist their session across app restarts.
- **AC:** Protected routes/screens (Dashboard, Camera) are inaccessible without a valid session.

### US-01 — Camera Capture

As a user, I want to photograph a receipt so that the app automatically extracts vendor, date, amount, and category via AI.

- **Extracted data is reviewable and editable before saving.**

### US-02 — Voice Input

As a user, I want to dictate an expense (e.g., "coffee 350 dinara") so that I can log it quickly without typing.

- **Extracted data is reviewable and editable before saving.**

### US-03 — Manual Input

As a user, I want to manually enter expense details via a form as a fallback input method.

### US-04 — Expense Timeline

As a user, I want to filter expenses by day, week, month, quarter, and year so that I can identify spending patterns.

### US-05 — Budget Alerts

As a user, I want to set a monthly budget per category so that I get notified at 80% and 100% usage.

- **AC:** Notifications work even when the app is closed.

### US-06 — Dashboard

As a user, I want a home screen showing an instant financial overview.

- **AC:** Dashboard displays:
  - Total spent this month vs budget
  - Top 3 spending categories
  - Recent transactions
  - Ect.

---
