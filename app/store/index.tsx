import { configureStore } from "@reduxjs/toolkit";
import themeReducer, { changeTheme } from "./slice/theme.slice";
import profileReducer from "./slice/profile.slice";
import roleReducer from "./slice/role.slice";
import userReducer from "./slice/user.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    profile: profileReducer,
    role: roleReducer,
    user: userReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
