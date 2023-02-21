import { configureStore } from "@reduxjs/toolkit";

import geolocatioReducer from "./geolocation-slice";
import feedReducer from "./feed-slice";
import feedMiddleware from "../middlewares/feed-middleware";
import uiSlice from "./ui-slice";

const store = configureStore({
  reducer: { geolocation: geolocatioReducer, feed: feedReducer, ui: uiSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware),
});

export default store;
