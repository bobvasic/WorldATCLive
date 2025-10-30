import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import geminiService from '../services/geminiService';

// Async thunks for AI operations
export const fetchCountryInfo = createAsyncThunk(
  'ai/fetchCountryInfo',
  async (countryName, { rejectWithValue }) => {
    try {
      const info = await geminiService.getCountryInfo(countryName);
      return { countryName, info };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTravelRecommendations = createAsyncThunk(
  'ai/fetchTravelRecommendations',
  async (countryName, { rejectWithValue }) => {
    try {
      const recommendations = await geminiService.getTravelRecommendations(countryName);
      return { countryName, recommendations };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const analyzeUserBehavior = createAsyncThunk(
  'ai/analyzeUserBehavior',
  async (interactions, { rejectWithValue }) => {
    try {
      const analysis = await geminiService.analyzeInteractions(interactions);
      return analysis;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isInitialized: false,
  countryInfo: {},
  travelRecommendations: {},
  userAnalysis: null,
  interactions: [],
  loading: {
    countryInfo: false,
    recommendations: false,
    analysis: false,
  },
  errors: {
    countryInfo: null,
    recommendations: null,
    analysis: null,
  },
  performance: {
    fps: 60,
    apiCalls: 0,
    cacheHits: 0,
  },
};

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    addInteraction: (state, action) => {
      state.interactions.push({
        ...action.payload,
        timestamp: Date.now(),
      });
      // Keep only last 100 interactions
      if (state.interactions.length > 100) {
        state.interactions.shift();
      }
    },
    clearInteractions: (state) => {
      state.interactions = [];
    },
    updatePerformance: (state, action) => {
      state.performance = {
        ...state.performance,
        ...action.payload,
      };
    },
    incrementApiCalls: (state) => {
      state.performance.apiCalls += 1;
    },
    incrementCacheHits: (state) => {
      state.performance.cacheHits += 1;
    },
    clearError: (state, action) => {
      if (action.payload) {
        state.errors[action.payload] = null;
      } else {
        state.errors = {
          countryInfo: null,
          recommendations: null,
          analysis: null,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Country Info
    builder
      .addCase(fetchCountryInfo.pending, (state) => {
        state.loading.countryInfo = true;
        state.errors.countryInfo = null;
      })
      .addCase(fetchCountryInfo.fulfilled, (state, action) => {
        state.loading.countryInfo = false;
        const { countryName, info } = action.payload;
        state.countryInfo[countryName] = info;
        state.performance.apiCalls += 1;
      })
      .addCase(fetchCountryInfo.rejected, (state, action) => {
        state.loading.countryInfo = false;
        state.errors.countryInfo = action.payload;
      });

    // Travel Recommendations
    builder
      .addCase(fetchTravelRecommendations.pending, (state) => {
        state.loading.recommendations = true;
        state.errors.recommendations = null;
      })
      .addCase(fetchTravelRecommendations.fulfilled, (state, action) => {
        state.loading.recommendations = false;
        const { countryName, recommendations } = action.payload;
        state.travelRecommendations[countryName] = recommendations;
        state.performance.apiCalls += 1;
      })
      .addCase(fetchTravelRecommendations.rejected, (state, action) => {
        state.loading.recommendations = false;
        state.errors.recommendations = action.payload;
      });

    // User Analysis
    builder
      .addCase(analyzeUserBehavior.pending, (state) => {
        state.loading.analysis = true;
        state.errors.analysis = null;
      })
      .addCase(analyzeUserBehavior.fulfilled, (state, action) => {
        state.loading.analysis = false;
        state.userAnalysis = action.payload;
        state.performance.apiCalls += 1;
      })
      .addCase(analyzeUserBehavior.rejected, (state, action) => {
        state.loading.analysis = false;
        state.errors.analysis = action.payload;
      });
  },
});

export const {
  setInitialized,
  addInteraction,
  clearInteractions,
  updatePerformance,
  incrementApiCalls,
  incrementCacheHits,
  clearError,
} = aiSlice.actions;

export default aiSlice.reducer;
