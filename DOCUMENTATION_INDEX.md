# 📚 Documentation Index

**World ATC Live - AI-Powered Geographic Intelligence Platform**

Complete guide to all project documentation and resources for World ATC Live.

---

## 🚀 Getting Started (Read First)

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[README.md](./README.md)** | Main project documentation | 10 min |
| **[QUICK_START.md](./QUICK_START.md)** | 3-step setup guide | 3 min |

**Start here:** [README.md](./README.md)

---

## 🤖 AI Integration Guides

### Primary Documentation

| Document | Purpose | Lines | For |
|----------|---------|-------|-----|
| **[AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md)** | Complete AI setup & configuration | 408 | Developers |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Technical implementation details | 533 | Technical leads |
| **[API_STATUS_REPORT.md](./API_STATUS_REPORT.md)** | Troubleshooting & API status | 243 | Operations |

### Key Topics Covered

**AI_SETUP_GUIDE.md:**
- Google Gemini API setup
- Feature descriptions with examples
- Configuration options
- Troubleshooting guide
- Deployment instructions
- Cost optimization
- Performance benchmarks

**IMPLEMENTATION_SUMMARY.md:**
- Complete feature breakdown
- Code statistics (3,100+ lines)
- Technical decisions & rationale
- Performance metrics
- Testing recommendations
- Handoff instructions

**API_STATUS_REPORT.md:**
- API key validation
- Rate limit handling
- Error scenarios & solutions
- Usage monitoring
- Cost analysis

---

## 💻 Code Documentation

### Source Code Structure

```
src/
├── components/          # React components
│   ├── WorldMapSimple.jsx        # Main map (130 lines)
│   ├── AICountryPanel.jsx        # AI insights panel (154 lines)
│   ├── AIAnalyticsDashboard.jsx  # Analytics (133 lines)
│   ├── PerformanceMonitor.jsx    # Performance metrics (98 lines)
│   ├── ErrorBoundary.jsx         # Error handling (104 lines)
│   └── AIComponents.css          # Styling (512 lines)
├── services/
│   └── geminiService.js          # AI service layer (270 lines)
├── store/
│   ├── store.js                  # Redux config (10 lines)
│   ├── mapSlice.js               # Map state (27 lines)
│   └── aiSlice.js                # AI state (171 lines)
├── App.jsx                        # Main app (74 lines)
└── main.jsx                       # Entry point (15 lines)
```

### Key Files to Understand

1. **`src/services/geminiService.js`** - Core AI logic
   - Lines 111-121: Country info prompt
   - Lines 157-168: Travel recommendations prompt
   - Lines 207-216: User analytics prompt

2. **`src/store/aiSlice.js`** - Redux state management
   - Lines 5-39: Async thunks for AI calls
   - Lines 41-62: Initial state structure
   - Lines 108-157: Async action handlers

3. **`src/components/AICountryPanel.jsx`** - UI for AI data
   - Lines 17-40: Data fetching logic
   - Lines 63-105: Country info display
   - Lines 107-147: Travel recommendations

---

## 🧪 Testing Scripts

### Available Tests

| Script | Purpose | Usage |
|--------|---------|-------|
| `test-gemini.js` | Full AI integration test (163 lines) | `node test-gemini.js` |
| `check-api.js` | Quick API key validation (48 lines) | `node check-api.js` |
| `test-prompt.js` | Test specific prompts (75 lines) | `node test-prompt.js` |
| `list-models.js` | List available models (41 lines) | `node list-models.js` |

### Test Coverage

**test-gemini.js includes:**
1. API key configuration test
2. API initialization test
3. Basic API request test
4. Country info generation test
5. Travel recommendations test

**Expected output:** All 5 tests passing

---

## ⚙️ Configuration Files

### Environment Configuration

| File | Purpose | Required |
|------|---------|----------|
| `.env.local` | API keys (gitignored) | ✅ Yes |
| `.env.local.example` | Template for setup | No |

**Environment Variables:**
```bash
VITE_GEMINI_API_KEY=your_api_key_here    # Required
VITE_GEMINI_MODEL=gemini-2.5-flash       # Optional
VITE_AI_CACHE_TTL=3600000                # Optional (1 hour)
```

### Build Configuration

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build settings |
| `eslint.config.js` | Code quality rules |
| `package.json` | Dependencies & scripts |

---

## 📊 Code Statistics

### Project Size

- **Total Lines:** ~3,100+ (code + documentation)
- **Source Code:** ~1,800 lines
- **CSS Styling:** 512 lines
- **Documentation:** ~1,400+ lines
- **Test Scripts:** ~327 lines

### Component Breakdown

| Component | Lines | Purpose |
|-----------|-------|---------|
| geminiService.js | 270 | AI API integration |
| aiSlice.js | 171 | Redux AI state |
| AICountryPanel.jsx | 154 | Country details UI |
| AIAnalyticsDashboard.jsx | 133 | Analytics UI |
| WorldMapSimple.jsx | 130 | Interactive map |
| ErrorBoundary.jsx | 104 | Error handling |
| PerformanceMonitor.jsx | 98 | Performance metrics |
| AIComponents.css | 512 | AI component styles |

### Dependencies

**Production:**
- React 19.1.1
- Redux Toolkit 2.9.2
- @google/generative-ai (latest)
- MapLibre GL 5.10.0
- react-map-gl 8.1.0
- Framer Motion 12.23.24

**Development:**
- Vite 7.1.14
- ESLint 9.36.0
- @vitejs/plugin-react 5.0.4

---

## 🎯 Feature Documentation

### 1. Real-Time Country Insights

**Implementation:** `src/services/geminiService.js` (lines 110-150)

**User Flow:**
1. User clicks country on map
2. `AICountryPanel` opens with loading state
3. Redux dispatches `fetchCountryInfo(countryName)`
4. `geminiService.getCountryInfo()` called
5. Gemini API generates response (1-2s)
6. JSON parsed and cached (1-hour TTL)
7. UI updates with data

**Prompt Template:**
```javascript
`You are a travel expert. Provide brief AI insights about ${countryName}.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "population": "actual population with capital city name",
  "capital": "capital city name only",
  "culturalFact": "one fascinating fact (max 80 chars)",
  "geography": "one interesting feature (max 80 chars)"
}

Be specific, engaging, and concise.`
```

### 2. TOP 10 Must-Visit Places

**Implementation:** `src/services/geminiService.js` (lines 156-183)

**User Flow:**
1. Country panel already open
2. Redux dispatches `fetchTravelRecommendations(countryName)`
3. `geminiService.getTravelRecommendations()` called
4. Gemini generates 10 places (~2-3s)
5. JSON array parsed and cached
6. Recommendations displayed with animations

**Prompt Template:**
```javascript
`You are a top travel expert. List the TOP 10 MUST-VISIT places in ${countryName}.

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "name": "place name",
    "description": "why visit (max 70 chars)",
    "type": "landmark" or "nature" or "cultural"
  }
]

Be specific with actual place names.`
```

### 3. User Behavior Analytics

**Implementation:** `src/services/geminiService.js` (lines 206-236)

**Tracked Data:**
- Country clicks
- Hover durations
- Unique countries explored
- Interaction timestamps

**AI Analysis:** Every 10 interactions, Gemini analyzes patterns and suggests destinations

### 4. Performance Monitoring

**Implementation:** `src/components/PerformanceMonitor.jsx`

**Real-Time Metrics:**
- FPS (frames per second)
- AI API calls count
- Cache hit rate percentage

---

## 🔧 Customization Guide

### Modify AI Prompts

**Edit:** `src/services/geminiService.js`

**Country Info Prompt:** Line 111
**Travel Tips Prompt:** Line 157
**Analytics Prompt:** Line 214

**Tips:**
- Keep prompts under 200 words
- Always specify JSON format
- Include character limits
- Test with `node test-prompt.js`

### Adjust Caching

**Edit:** `.env.local`

```bash
# Default: 1 hour (3600000 ms)
VITE_AI_CACHE_TTL=7200000  # 2 hours

# Or in code (src/services/geminiService.js line 11)
this.cacheTTL = parseInt(import.meta.env.VITE_AI_CACHE_TTL || '3600000', 10);
```

### Change AI Model

**Available Models:**
- `gemini-2.5-flash` (fastest, recommended)
- `gemini-2.5-pro` (more accurate, slower, costs more)
- `gemini-2.0-flash` (alternative)

**Edit:** `.env.local`
```bash
VITE_GEMINI_MODEL=gemini-2.5-pro
```

---

## 🐛 Troubleshooting Reference

### Quick Diagnostics

```bash
# 1. Check API key
node check-api.js

# 2. Test AI integration
node test-gemini.js

# 3. Verify build
npm run build

# 4. Check code quality
npm run lint
```

### Common Issues

| Issue | Document | Section |
|-------|----------|---------|
| Rate limit exceeded | API_STATUS_REPORT.md | Rate Limit Solutions |
| Panel not opening | README.md | Troubleshooting |
| AI not generating data | AI_SETUP_GUIDE.md | Troubleshooting |
| Build errors | README.md | Build Errors |
| Performance issues | README.md | Performance Issues |

---

## 📞 Support Resources

### Documentation Links

- **Main README:** [README.md](./README.md)
- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **AI Setup:** [AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md)
- **Implementation:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **API Status:** [API_STATUS_REPORT.md](./API_STATUS_REPORT.md)

### External Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **Get API Key:** https://aistudio.google.com/app/apikey
- **Usage Dashboard:** https://ai.google.dev/usage
- **GitHub Repo:** https://github.com/bobvasic/WorldATCLive

---

## ✅ Documentation Checklist

For new team members, read in this order:

- [ ] README.md - Project overview
- [ ] QUICK_START.md - Get running in 3 minutes
- [ ] AI_SETUP_GUIDE.md - Understand AI features
- [ ] IMPLEMENTATION_SUMMARY.md - Technical deep dive
- [ ] Run `node test-gemini.js` - Verify setup
- [ ] Explore `src/services/geminiService.js` - Core AI logic
- [ ] Review `src/components/AICountryPanel.jsx` - UI implementation

**Total reading time:** ~30 minutes

---

**Last Updated:** October 30, 2025  
**Documentation Version:** 1.0  
**Project Status:** Production Ready ✅

---

© 2025 Bob Vasic, Jelena Stricak • AI-Enhanced by Tim
