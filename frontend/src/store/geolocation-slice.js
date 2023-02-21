import { createSlice } from "@reduxjs/toolkit";

const initialPositionState = {
  coords: { lat: null, lng: null },
  isLocationAllowed: false,
};

const geolocationSlice = createSlice({
  name: "geolocation",
  initialState: initialPositionState,
  reducers: {
    getGeolocation(state, action) {
      state.coords.lat = action.payload.lat;
      state.coords.lng = action.payload.lng;
      state.isLocationAllowed = true;
    },
  },
});

export const geolocationActions = geolocationSlice.actions;

export default geolocationSlice.reducer;
