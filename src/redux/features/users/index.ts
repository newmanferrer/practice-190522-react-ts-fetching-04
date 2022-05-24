import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { user, userPartial } from '../../../models';

interface initialState {
  isLoading: boolean;
  isUpdatePut: boolean;
  users: user[];
  userToEdit: null | user;
  successMessage: string;
  errorMessage: string;
}

const initialState: initialState = {
  isLoading: false,
  isUpdatePut: false,
  users: [],
  userToEdit: null,
  successMessage: '',
  errorMessage: ''
};

const URL = 'http://localhost:5000/users';

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const response = await axios.get(URL);
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (user: user) => {
  const response = await axios.post(URL, {
    name: user.name,
    username: user.username,
    email: user.email
  });
  return response.data;
});

export const updatePutUser = createAsyncThunk('users/updatePutUser', async (user: user) => {
  const response = await axios.put(`${URL}/${user.id}`, {
    name: user.name,
    username: user.username,
    email: user.email
  });
  return response.data;
});

export const updatePatchUser = createAsyncThunk(
  'users/updatePatchUser',
  async ({ id, ...rest }: user | userPartial) => {
    const response = await axios.patch(`${URL}/${id}`, {
      name: rest.name && rest.name,
      username: rest.username && rest.username,
      email: rest.email && rest.email
    });
    return response.data;
  }
);

export const deleteUser = createAsyncThunk('users/deleteUser', async (user: user) => {
  await axios.delete(`${URL}/${user.id}`);
  return user;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserToEdit: (state, action: PayloadAction<user | null>) => {
      state.userToEdit = action.payload;
    },
    setIsUpdatePut: (state, action: PayloadAction<boolean>) => {
      state.isUpdatePut = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    }
  },
  extraReducers: builder => {
    //* getUsers
    builder.addCase(getUsers.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action: PayloadAction<user[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message || 'Get Users: Something went wrong';
    });
    //* createUser
    builder.addCase(createUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<user>) => {
      state.isLoading = false;
      state.users.push(action.payload);
      state.successMessage = `The user ${action.payload.name}, has been created`;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message || 'Create Users: Something went wrong';
    });
    //* updatePutUser
    builder.addCase(updatePutUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updatePutUser.fulfilled, (state, action: PayloadAction<user>) => {
      state.isLoading = false;
      state.users = state.users.map(user => (user.id === action.payload.id ? action.payload : user));
      state.successMessage = `The user ${action.payload.name}, has been updated`;
    });
    builder.addCase(updatePutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message || 'Update Users: Something went wrong';
    });
    //* updatePatchUser
    builder.addCase(updatePatchUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updatePatchUser.fulfilled, (state, action: PayloadAction<user>) => {
      state.isLoading = false;
      state.users = state.users.map(user => (user.id === action.payload.id ? action.payload : user));
      state.successMessage = `The user ${action.payload.name}, has been updated`;
    });
    builder.addCase(updatePatchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message || 'Update Users: Something went wrong';
    });
    //* deleteUser
    builder.addCase(deleteUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<user>) => {
      state.isLoading = false;
      state.users = state.users.filter(user => user.id !== action.payload.id);
      state.successMessage = `The user ${action.payload.name}, has been deleted`;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message || 'Delete User: Something went wrong';
    });
  }
});

export const usersReducer = usersSlice.reducer;
export const { setUserToEdit, setIsUpdatePut, setSuccessMessage, setErrorMessage } = usersSlice.actions;
