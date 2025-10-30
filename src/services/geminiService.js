import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Service - Enterprise-grade AI integration
 * Handles all AI-powered features with intelligent caching and error recovery
 */
class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
    this.cacheTTL = parseInt(import.meta.env.VITE_AI_CACHE_TTL || '3600000', 10);
    this.cache = new Map();
    this.genAI = null;
    this.generativeModel = null;
    this.requestQueue = [];
    this.isProcessing = false;
  }

  /**
   * Initialize Gemini API connection
   */
  initialize() {
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.warn('⚠️ Gemini API key not configured. AI features disabled.');
      return false;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.generativeModel = this.genAI.getGenerativeModel({ model: this.model });
      console.log('✅ Gemini AI initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Gemini AI initialization failed:', error);
      return false;
    }
  }

  /**
   * Check if AI is available and initialized
   */
  isAvailable() {
    return this.genAI !== null && this.generativeModel !== null;
  }

  /**
   * Get cached response or null
   */
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('🎯 Cache hit:', key);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Set cache with timestamp
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Generate AI response with error handling and retry logic
   */
  async generateResponse(prompt, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('AI service not initialized');
    }

    const cacheKey = options.cacheKey || prompt;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const maxRetries = options.maxRetries || 2;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.generativeModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        this.setCache(cacheKey, text);
        return text;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ AI generation attempt ${attempt + 1} failed:`, error.message);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError;
  }

  /**
   * Get rich country information with AI enhancement
   */
  async getCountryInfo(countryName) {
    const prompt = `You are a travel expert. Provide brief AI insights about ${countryName}.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "population": "actual population with capital city name",
  "capital": "capital city name only",
  "culturalFact": "one fascinating cultural or historical fact (max 80 chars)",
  "geography": "one interesting geographical feature (max 80 chars)"
}

Be specific, engaging, and concise.`;

    try {
      const response = await this.generateResponse(prompt, {
        cacheKey: `country_info_${countryName}`,
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return data;
      }
      
      // Fallback
      return {
        population: 'Information loading...',
        capital: countryName,
        culturalFact: 'Rich cultural heritage and diverse landscapes',
        geography: 'Unique geographical features and landmarks',
      };
    } catch (error) {
      console.error('AI country info error:', error);
      return {
        population: 'Data temporarily unavailable',
        capital: countryName,
        culturalFact: 'Fascinating history and culture',
        geography: 'Beautiful landscapes and landmarks',
      };
    }
  }

  /**
   * Get AI-powered travel recommendations - TOP 10 MUST-VISIT PLACES
   */
  async getTravelRecommendations(countryName) {
    const prompt = `You are a top travel expert. List the TOP 10 MUST-VISIT places in ${countryName} for travelers.

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "name": "place name",
    "description": "why visit (max 70 chars)",
    "type": "landmark" or "nature" or "cultural"
  }
]

Be specific with actual place names. Make descriptions exciting and brief.`;

    try {
      const response = await this.generateResponse(prompt, {
        cacheKey: `travel_${countryName}`,
      });

      // Extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return data.slice(0, 10); // Ensure max 10
      }
      
      return [];
    } catch (error) {
      console.error('AI travel recommendations error:', error);
      return [];
    }
  }

  /**
   * Natural language country search with AI
   */
  async searchCountries(query, allCountries) {
    const prompt = `Given this search query: "${query}" and this list of countries: ${allCountries.slice(0, 50).join(', ')}...
Return the top 5 most relevant country names as a JSON array. Consider:
- Direct name matches
- Regional references
- Cultural keywords
- Geographic features
Only return country names that exist in the provided list.`;

    try {
      const response = await this.generateResponse(prompt, {
        cacheKey: `search_${query}`,
        maxRetries: 1,
      });

      try {
        return JSON.parse(response);
      } catch {
        // Fallback to simple string matching
        return allCountries
          .filter(country => 
            country.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5);
      }
    } catch (error) {
      console.error('AI search error:', error);
      // Fallback to simple search
      return allCountries
        .filter(country => 
          country.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
    }
  }

  /**
   * Analyze user interaction patterns with AI
   */
  async analyzeInteractions(interactions) {
    const summary = {
      totalHovers: interactions.length,
      uniqueCountries: new Set(interactions.map(i => i.country)).size,
      mostVisited: this.getMostFrequent(interactions.map(i => i.country)),
      avgDuration: interactions.reduce((sum, i) => sum + (i.duration || 0), 0) / interactions.length,
    };

    const prompt = `Analyze this user interaction data: ${JSON.stringify(summary)}
Provide 2-3 insights about user interests and suggest 2 countries they might enjoy exploring.
Return as JSON: { insights: [string array], suggestions: [country names] }`;

    try {
      const response = await this.generateResponse(prompt, {
        cacheKey: `analysis_${summary.uniqueCountries}_${summary.totalHovers}`,
        maxRetries: 1,
      });

      try {
        return JSON.parse(response);
      } catch {
        return {
          insights: ['Exploring diverse regions', 'Curious traveler'],
          suggestions: [summary.mostVisited],
        };
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      return null;
    }
  }

  /**
   * Helper: Get most frequent item
   */
  getMostFrequent(arr) {
    const freq = {};
    arr.forEach(item => {
      freq[item] = (freq[item] || 0) + 1;
    });
    return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
  }

  /**
   * Clear cache (for memory management)
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 AI cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const geminiService = new GeminiService();
export default geminiService;
