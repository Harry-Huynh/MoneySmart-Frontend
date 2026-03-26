# 📝 Money Smart Website

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-38B2AC?logo=tailwindcss)
![AI](https://img.shields.io/badge/AI-Insights-purple)
![JWT](https://img.shields.io/badge/Auth-JWT-green)
![Deploy-Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

A modern **personal finance dashboard** built with **Next.js**, **React**, and **Tailwind CSS**, designed to help users **track spending, manage budgets, and gain AI-powered financial insights**.

---

## 📄 License

> Copyright (c) 2026  
> This project is licensed under the ISC License.

---

## 📚 Table of Contents

- [📝 Money Smart Website](#-money-smart-website)
  - [🔗 Project Links](#-project-links)
  - [🚀 Features](#-features)
  - [📦 Dependencies](#-dependencies)
  - [🌐 API Endpoints](#-api-endpoints)
  - [🧩 Key Components \& Pages](#-key-components--pages)
  - [📊 Dashboard Overview](#-dashboard-overview)
  - [🛡️ Route Protection Flow](#️-route-protection-flow)
  - [🤖 AI Insights](#-ai-insights)
  - [📌 Notes](#-notes)

---

## 🔗 Project Links

- 🖥️ Backend Repository: *(Add your backend repo link here)*
- 🌐 Live Website: *(Add your deployed link here)*

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login system
  - Secure protected routes

- 💰 **Budget Management**
  - Create, update, delete budgets
  - Track **spending vs budget (usedAmount)**
  - Monthly budget filtering

- 💳 **Transaction Tracking**
  - View recent transactions
  - Categorize income & expenses

- 📊 **Dashboard Analytics**
  - Current balance overview
  - Spending trends chart
  - Category-based spending pie chart
  - Budget usage visualization

- 🎯 **Saving Goals**
  - Track progress toward financial goals
  - Target vs current amount

- 📂 **Data Import**
  - Import transaction data from external sources (e.g., CSV files)
  - Automatically categorize and store imported transactions

- 🔔 **Notifications**
  - Alerts when spending exceeds budget thresholds
  - Reminders for financial goals
  - Real-time feedback on financial activity

- ⚙️ **User Settings**
  - Customize date format (e.g., YYYY-MM-DD, DD-MM-YYYY)
  - Manage personal profile (name, region, phone number)
  - Configure user preferences

- 🤖 **AI Financial Insights**
  - Analyze spending behavior
  - Provide smart suggestions
  - Monthly financial summaries

- 📱 **Responsive Design**
  - Built with Tailwind CSS
  - Works on desktop and mobile

---

## 📦 Dependencies

- `next`
- `react`
- `tailwindcss`
- `recharts`
- `axios`

### Custom Modules

- `@/lib/budget.actions` → Budget API calls
- `@/lib/budgetNotification.actions` → Budget Notification API calls
- `@/lib/budgetEmailContent.actions` → Budget Email Content API calls
- `@/lib/import.actions` → import data to backend
- `@/lib/notficationt.actions` → Notifications API calls
- `@/lib/notificationList.actions` → Notification List API calls
- `@/lib/notificationSetting.actions` → Notification setting API calls
- `@/lib/savingGoal.actions` → Saving goals API calls
- `@/lib/savingGoalNotification.actions` → Saving goals notification API calls
- `@/lib/transaction.actions` → Transaction API calls
- `@/lib/user.actions` → Authentication & profile
- `@/lib/utils` → Helper functions
- `@/AI/userPrompt.actions` → AI insight generation

---

## 🌐 API Endpoints

| Endpoint | Description |
|--------|------------|
| `/login` | Authenticate user |
| `/register` | Register new user |
| `/budgets` | Get budgets (supports month/year query) |
| `/budget/:id` | Get/update/delete a specific budget |
| `/transactions` | Fetch transaction history |
| `/saving-goals` | Manage saving goals |
| `/import` | Import transaction data |
| `/notifications` | Fetch user notifications |
| `/user/profile` | Get/update user settings |
| `/ai/insights` | Generate AI financial insights |

---

## 🧩 Key Components & Pages

- **DashboardClient**
  - Main dashboard container
  - Combines all financial widgets

- **BalanceCard**
  - Displays total balance summary

- **BudgetCard**
  - Shows budget usage overview

- **SavingGoalsCard**
  - Displays saving goals progress

- **DashboardTransactionCard**
  - Lists recent transactions

- **TrendChart**
  - Displays spending trends over time

- **SpendingCategoryChart**
  - Pie chart of **budget spending (usedAmount)** by category

- **Budgets Page**
  - Monthly budget management
  - Includes navigation between months

- **Import Page**
  - Upload and process transaction files

- **Export Page**
  - Export Transactions files from selection month

- **Notifications Component**
  - Displays alerts and reminders

- **Settings Page**
  - Manage user preferences and profile

---

## 📊 Dashboard Overview

The dashboard provides a **centralized financial overview**:

- 💰 Balance Section
- 📊 Trend Chart (Spending Over Time)
- 🥧 Category Pie Chart (Budget Spending)
- 📋 Recent Transactions
- 🎯 Saving Goals
- 💰 Spending Budgets
- 🔔 Notifications Overview

**Key Idea:**

Instead of raw transactions, the pie chart uses **budget spending (usedAmount)** to reflect real financial behavior.

---

## 🛡️ Route Protection Flow

1. User logs in and receives a JWT token
2. Token is stored (e.g., localStorage)
3. Protected routes verify authentication
4. Unauthorized users are redirected to `/login`
5. After login:
   - Dashboard data is fetched
   - Budgets, transactions, goals, and notifications are loaded

---

## 🤖 AI Insights

The app integrates AI to provide:

- 📊 Monthly spending analysis
- 💡 Smart recommendations
- 📈 Financial summaries

Example insights:

- "You spent 25% more on food this month"
- "Consider reducing entertainment expenses"

---

