# ⚡ Quick Start Guide

## 🎯 Get Running in 3 Steps

### Step 1: Get Your API Key (2 minutes)
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Add API Key (30 seconds)
Open `.env.local` and paste your key:
```bash
VITE_GEMINI_API_KEY=AIzaSyBk7FH3jKl9mPqRsT2vW8xYzAbCdEfGhIj
```

### Step 3: Start the App (30 seconds)
```bash
npm run dev
```

**Done!** Open http://localhost:5173

---

## 🎮 How to Use AI Features

### **Click Any Country**
→ AI panel slides in with:
- Real-time country facts
- AI-generated insights
- Travel recommendations

### **Top-Left Dashboard**
→ Click to expand:
- Interaction stats
- AI behavior analysis
- Personalized recommendations

### **Bottom-Left Monitor**
→ Real-time performance:
- FPS counter
- AI API call tracking
- Cache efficiency

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Your API key goes here |
| `AI_SETUP_GUIDE.md` | Complete documentation |
| `IMPLEMENTATION_SUMMARY.md` | Technical details |
| `src/services/geminiService.js` | AI logic |
| `src/App.jsx` | Main integration |

---

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add API key to Vercel
vercel env add VITE_GEMINI_API_KEY production
```

### Netlify
1. Connect GitHub repo
2. Add environment variable: `VITE_GEMINI_API_KEY`
3. Deploy

---

## 🐛 Troubleshooting

### "AI features disabled" message?
→ Check `.env.local` has your API key  
→ Restart server: `npm run dev`

### Country panel not opening?
→ Make sure you **click** the country (not just hover)

### Performance issues?
→ Close other browser tabs  
→ Check GPU acceleration enabled

---

## 📞 Need Help?

- **Full Guide:** `AI_SETUP_GUIDE.md`
- **Technical Details:** `IMPLEMENTATION_SUMMARY.md`
- **Contact:** bob@cyberlinksec.com

---

**Built by Tim (AI-Enhanced Senior Enterprise Developer)**  
**CyberLink Security** 🔐
