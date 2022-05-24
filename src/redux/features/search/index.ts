import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialState {
  search: string;
}

const initialState: initialState = {
  search: ''
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    }
  }
});

export const searchReducer = searchSlice.reducer;
export const { setSearch } = searchSlice.actions;
