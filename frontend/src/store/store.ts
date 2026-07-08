import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // api: apiSlice.reducer will be added later
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(), // .concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
