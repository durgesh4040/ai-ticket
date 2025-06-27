# 🎫 AI-Powered Ticket Management System

An intelligent support ticketing system built to streamline and automate support operations. Powered by AI, it categorizes, prioritizes, and assigns tickets to the right moderators based on their skills, ensuring fast and relevant support at scale.

## 🚀 Features

### 🤖 AI-Driven Ticketing
- **Auto Categorization** using Gemini NLP
- **Smart Priority Assignment** based on urgency and context
- **Moderator Notes** generated via AI to aid resolution

### 🎯 Smart Assignment
- **Skill-Based Ticket Routing**
- **Admin Fallback** when no suitable moderator found
- **Real-Time Moderator Matching**

### 👥 User & Access Management
- **Role-Based Access**: User, Moderator, Admin
- **Moderator Skill Profiles**
- **JWT Secured Endpoints**

### ⚙️ Background Processing
- **Event-Driven Workflows** using Inngest
- **Async Ticket Handling**
- **Email Alerts** on assignments, status changes, etc.

---


## 🛠️ Tech Stack

| Layer               | Technology                      |
|--------------------|----------------------------------|
| Backend            | Node.js + Express                |
| Database           | MongoDB                          |
| Authentication     | JWT (JSON Web Tokens)            |
| Background Jobs    | Inngest                          |
| AI Integration     | Google Gemini API                |
| Email Notifications| Nodemailer + Mailtrap            |
| Dev Environment    | Nodemon (Hot Reloading)          |

