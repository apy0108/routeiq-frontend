# 🚀 ChatIQ — AI Chatbot Builder Platform (Frontend)

AI-powered chatbots trained on your website. No technical skills needed.

---

## ⚡ Quick Start (How to Run)

### 1. Open Terminal in the project directory
```bash
cd e:\routeiq-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🛠️ Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Vite local development server on port 5173 with hot reloading |
| `npm run build` | Builds the production bundle into the `dist/` folder |
| `npm run preview`| Locally previews the production build at `http://localhost:4173` |

---

## 🌐 API Configuration

Configured in [`src/config.js`](file:///e:/routeiq-frontend/src/config.js):

```javascript
export const API_BASE = 'http://161.118.169.58:3000';
```

---

## 🧭 Application Routes & Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Landing Page** | Clean hero, 3 feature pillars, 3-step workflow, and platform comparison table |
| `/create` | **Chatbot Builder Wizard** | 3-step wizard calling real backend API (`POST /api/bots` ➔ `POST /api/train/url` with 3s polling ➔ `PUT /api/bots/:botId` with live preview) |
| `/embed/:botId` | **Success & Embed Page** | Real chat widget calling `POST /api/chat`, exact `<script src="http://161.118.169.58:3000/widget/widget.js" data-bot-id="REAL_BOT_UUID" async></script>`, and platform guides (WordPress, Wix, Shopify, HTML) |
| `/dashboard/:botId` | **Bot Dashboard** | Real metrics, searchable captured leads table with CSV export, recent conversations, and knowledge retrain modal |
