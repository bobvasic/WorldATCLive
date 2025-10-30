import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zoom: 1,
  center: [0, 20],
  isLoaded: false,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setZoom, setCenter, setLoaded } = mapSlice.actions;
export default mapSlice.reducer;
