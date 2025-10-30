import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './mapSlice';
import aiReducer from './aiSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    ai: aiReducer,
  },
});
