import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  } | null;
}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState')
    if (serializedState === null) {
      return { isAuthenticated: false, token: null, user: null }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return { isAuthenticated: false, token: null, user: null }
  }
}

const initialState: AuthState = loadState()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authState', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authState');
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
