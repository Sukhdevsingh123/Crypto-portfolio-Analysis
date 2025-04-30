# 🚀 CryptoPulse AI

Welcome to **CryptoPulse AI** — your ultimate AI-powered crypto trading companion! 🌟 Whether you're a beginner or a pro, this platform helps you master **futures and options (F&O)** trading on **Bitcoin and Ether** with smart automation, intelligent AI, and real-time portfolio management.

---

## ✨ Features

### 🤖 Automated Trading
AI-powered strategies for seamless futures and options trading based on market trends.

### 💬 Interactive AI Bot
Ask anything about:
- 📉 Trading strategies
- ⛓️ Blockchain technology
- 📊 Stock & crypto markets
- 💸 Alpaca account insights (cash, equity, buying power)

### 📋 Portfolio Management
Connect your **Alpaca** account to view:
- Cash 💰
- Equity 📈
- Buying power ♻️
- Account status 📊

### 🕒 24/7 Open Markets
Trade anytime with 24/7 crypto markets, INR settlement, and optimized margining.

### 🌙☀️ Dark/Light Theme
Enjoy a smooth, modern UI with a theme toggle for dark or light modes.

### 📱 Responsive Design
Optimized for desktop, tablet, and mobile.

### 🔒 OAuth Integration
Secure login with Alpaca using **OAuth 2.0**.

### 🌐 Multi-Chain Support
Seamlessly trade across multiple blockchains, including Ethereum, Solana, and Polygon. Expand your strategy beyond Bitcoin and Ether with cross-chain AI insights.

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
-chart liberary
### APIs
- **Alpaca Account API:** `GET /account`
- **Alpaca Trading API:** `POST /orders`
- **Alpaca Market Data API:** `GET /bars`, `GET /quotes`
- **Alpaca Streaming API:** WebSocket streaming
- **Alpaca Authentication API:** OAuth 2.0 (`/auth/login`)
- **Custom AI API:** `http://localhost:3000/api/ai-prompt`

### AI Decision-Making
Custom-trained **machine learning models** with **NLP** for bot responses and predictive strategies focused on **risk management** and **efficiency**.

---

## 📦 Dependencies

### Frontend
- `react`, `react-dom`
- `react-router-dom`
- `axios`
- `tailwindcss`

### Backend
- `express`
- `axios`
- `cors`
- `dotenv`

---

## 🔑 Environment Variables (.env)

Create a `.env` file in the `backend/` directory:
```
ALPACA_BASE_URL="https://data.alpaca.markets"
ALPACA_API_KEY="your alpaca api key"
ALPACA_API_SECRET="your alpaca secret key"
ALPACA_ACCOUNT_URL="https://paper-api.alpaca.markets"
OPENAI_API_KEY="your openAi api key"
PORT=5000
ALPACA_OAUTH_CLIENT_ID="your alpaca connected apps client id"
ALPACA_OAUTH_CLIENT_SECRET="your alpaca connected apps client secret"
ALPACA_OAUTH_REDIRECT_URI="your frontend live url/auth/callback"
```

> ⚠️ Add `.env` to `.gitignore`

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js v16+
- Alpaca account
- Code editor (e.g., VS Code)

### 📅 Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Sukhdevsingh123/Crypto-portfolio-Analysis.git
cd Crypto-portfolio-Analysis
```

#### 2. Set Up Backend
```bash
cd backend
npm install
# Add your .env file here
```

#### 3. Set Up Frontend
```bash
cd ../frontend
npm install
```

#### 4. Run the App
```bash
# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm run dev
```

Visit: `crypto-portfolio-analysis-jade.vercel.app` 🎉

---

## 💽 Usage

- 🏠 **Home Page:** Overview & access to AI Bot
- 💬 **AI Bot:** `/bot` route for:
  - "Should I buy BTC/USD?"
  - "What is trading & stock market?"
  - "Check my Alpaca account."
  - "Check my account is gain profit or loss."
- 🔐 **Sign Up:** `/signup` for OAuth authentication
- 🌙 **Theme Toggle:** Navbar/footer buttons
- 🌐 **Multi-Chain Dashboard:** View and manage assets across Ethereum, Solana, and Polygon

---

## 🌟 Contributing

We welcome contributions!

1. 🍴 Fork the repo
2. 🔀 Create a feature branch: `git checkout -b feature/your-feature`
3. ✅ Commit changes: `git commit -m "Add your feature"`
4. 🚀 Push: `git push origin feature/your-feature`
5. 📅 Submit a Pull Request

---

## 📜 License

Licensed under the **MIT License**. See `LICENSE` for details.

---

## 📧 Contact

- Email: [sukhdev@techsteck.com](mailto:sukhdev@techsteck.com)
-contact:+91 9664627236
- Twitter 🐦
- Facebook 💼
- LinkedIn 🔗

> **Trade smarter with CryptoPulse AI! 🚀💸**

