import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ADD_PARTICIPANT, SET_MAIN_STREAM } from "./action";
import { reducer } from "./reducer";

export const store = configureStore({
  reducer: {
    user: reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [SET_MAIN_STREAM, ADD_PARTICIPANT],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload"],
        // Ignore these paths in the state
        ignoredPaths: ["user.mainStream", "user.participants"],
      },
    }),
});
