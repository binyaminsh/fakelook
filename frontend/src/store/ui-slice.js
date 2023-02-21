import { createSlice } from "@reduxjs/toolkit";

const initialUiState = { showFeed: false, notification: null };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleShowFeed(state) {
      state.showFeed = !state.showFeed;
    },
    // showNotification(state, action) {
    //   state.notification = {
    //     status: action.payload.status,
    //     title: action.payload.title,
    //     message: action.payload.message,
    //   };
    // },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
