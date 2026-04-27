# 🚀 Omnichannel Marketing Platform (Email & WhatsApp)

A premium, production-ready SaaS platform for managing large-scale Email and WhatsApp marketing campaigns. Built with a focus on high concurrency, data isolation, and a stunning glassmorphic UI.

---

## ✨ Key Features

### 📧 Email Marketing
- **Visual Template Designer**: Real-time HTML preview with dynamic placeholders.
- **Dynamic SMTP Configuration**: Database-driven SMTP settings that can be switched on-the-fly per user.
- **Campaign Scheduling**: Background processing with configurable sending delays.
- **Detailed Analytics**: Real-time tracking of sent vs failed messages with detailed logs.

### 📱 WhatsApp Marketing
- **Strategy Design Pattern**: Native integration with Meta Cloud API, Twilio, and custom gateways without bloated SDKs.
- **WhatsApp Templates**: Dedicated designer for WhatsApp messages with support for media and dynamic tags.
- **Multi-Tenant Scoping**: Every contact, list, and campaign is strictly isolated per user.

### 🛠️ Technical Excellence
- **Laravel 11 Backend**: Leveraging modern PHP 8.2+ features.
- **React 18 Frontend**: Snappy SPA experience powered by Inertia.js.
- **Asynchronous Queues**: Handles thousands of messages in the background without UI lag.
- **Glassmorphic UI**: Premium design system built with Tailwind CSS and Framer Motion.

---

## 🏗️ Architectural Analysis

For a deep dive into the engineering decisions, design patterns, and technical stack used in this project, please refer to the **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** file.

### Key Engineering Highlights:
- **Strategy Pattern** for interchangeable WhatsApp gateways.
- **Inertia.js Bridge** for seamless Laravel-React integration.
- **Asynchronous Queue Workers** with rate-limiting and delay algorithms.
- **User-Specific Runtime Configuration** for SMTP and API tokens.

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js & NPM
- Composer

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd email-marketing-tool
   ```

2. **Install Dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Configuration:**
   Configure your database in `.env` and run migrations:
   ```bash
   php artisan migrate
   ```

5. **Start the Application:**
   ```bash
   # Terminal 1: Laravel Server
   php artisan serve

   # Terminal 2: Frontend Assets
   npm run dev

   # Terminal 3: Queue Worker (Required for sending messages)
   php artisan queue:work
   ```

---

## 📈 Dashboard & Analytics

The platform provides a comprehensive dashboard for both Email and WhatsApp modules, giving you real-time insights into your marketing performance.

---

## 📄 License
The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
