import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      console.log(action);
      state.user = action.payload
    },
    removeUser: (state) => {
      state.user = null;
    }
  },
})

export const { saveUser, removeUser } = authSlice.actions

export default authSlice.reducer