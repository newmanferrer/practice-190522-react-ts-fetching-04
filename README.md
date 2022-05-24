# PRACTICE: REACT WHIT TYPESCRIPT FETCHING OF DATA 04 - REDUX TOOLKIT

## Project description

Practice react with typescript using redux toolkit (RTK) for requests to the JSON Placeholder and JSON Server.
It is a simple project where we will implement a CRUD, the most important thing is to practice the tools and options available when using RTK for asynchronous requests.

## Used technology

- Html 5
- CSS
- JavaScript
- TypeScript
- React
- Redux Toolkit
- React Redux
- Axios
- Styled Components
- ESLint
- Prettier
- Vite

## Resources used

JSON Server: https://github.com/typicode/json-server

API JSON Placeholder: https://jsonplaceholder.typicode.com/

## Developers: Requirements

- Nodejs
- Web Browser
- Code editor

## Developers: Installtion

1. Clone the repository: https://github.com/newmanferrer/practice-190522-react-ts-fetching-04.git
2. Another option is to download the repository using ZIP format.
3. Install the dependencies using the command "yarn add", from the terminal console.
4. From the terminal console, execute the “yarn dev” command, to run the development server.
5. From the terminal console, execute the “yarn run fake-api” command, to run the json server.

## Important Notes, Suggestions and Recommendations

1. RTK takes inspiration from and uses the Immer library to allow you to write clearer and simpler immutable state update logic automatically, while keeping state immutability clear.

Example without Immer:

```js
builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<user[]>) => {
  return {
    ...state,
    isLoading: false,
    users: action.payload,
    errorMessage: ''
  };
});
```

Example with Immer:

```js
builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<user[]>) => {
  state.isLoading = false;
  state.users = action.payload;
  state.errorMessage = '';
});
```

# REDUX TOOLKIT (RTK)

The official, opinionated, batteries-included toolset for efficient Redux development.

Includes utilities to simplify common use cases like store setup, creating reducers, immutable update logic, and more.

Link: https://redux-toolkit.js.org/

# Examples

## 1.- GET Request

### Store

```js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users';

export const store = configureStore({
  reducer: {
    users: usersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Hook

```js
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

### Features - Slice

```js
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { user } from '../../../models';

interface initialState {
  isLoading: boolean;
  users: user[];
  errorMessage: string;
}

const initialState: initialState = {
  isLoading: false,
  users: [],
  errorMessage: ''
};

const URL = 'http://localhost:5000/users';

// using axios
export const fetchUsers = createAsyncThunk('users/fetchUsers', () => {
  return axios.get(URL).then(response => response.data);
});

// example using axios (async function)
export const fetchUsers2 = createAsyncThunk('users/fetchUsers2', async () => {
  const response = await axios.get(URL);
  return response.data;
});

// example using fetch api
export const fetchApiUsers = createAsyncThunk('users/fetchApiUsers', () => {
  return fetch(URL).then(response => response.json());
});

// example using fetch api (async function)
export const fetchApiUsers2 = createAsyncThunk('users/fetchApiUsers2', async () => {
  const response = await fetch(URL);
  return await response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<user[]>) => {
      state.isLoading = false;
      state.users = action.payload;
      state.errorMessage = '';
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.users = [];
      state.errorMessage = action.error.message || 'Something went wrong';
    });
  }
});

export default usersSlice.reducer;

//* -----------------------------------------------------------------------------------------------
//* NOTES:
//* without the use of immer we would have to do something like this to maintain state immutability.
//* -----------------------------------------------------------------------------------------------
/*
builder.addCase(fetchUsers.pending, state => {
  return {
    ...state,
    isLoading: true
  };
});
builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<user[]>) => {
  return {
    ...state,
    isLoading: false,
    users: action.payload,
    errorMessage: ''
  };
});
builder.addCase(fetchUsers.rejected, (state, action) => {
  return {
    ...state,
    isLoading: false,
    users: [],
    errorMessage: action.error.message || 'Something went wrong'
  };
});
*/
//* -----------------------------------------------------------------------------------------------
```

### In App

```js
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './hooks';
import { fetchUsers } from './redux/features/users';
import { GlobalStyles, Title, Loader, Message } from './components';

export const App = () => {
  const { isLoading, users, errorMessage } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div>
      <GlobalStyles />
      <Title text='React with TS - Fetching 04 - RTK' />
      {isLoading && <Loader />}
      {!isLoading && errorMessage && <Message type='error' text={errorMessage} />}
      {!isLoading && !errorMessage ? (
        users.length ? (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <Message type='error' text='No users yet...' />
        )
      ) : null}
    </div>
  );
};
```

## 2.- RTK Query

Below is a simple example of RTK Query. In the next part (part 5), the same CRUD will be shown using only RTK Query.

### Store

```js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users';
import { usersApi } from '../../services/fake-api';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(usersApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### In services

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { user } from '../../models';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: builder => ({
    getUsers: builder.query<user[], void>({
      query: () => 'users'
    })
  })
});

export const { useGetUsersQuery } = usersApi;
```

### In App

```js
import { useGetUsersQuery } from './services/fake-api';
import { GlobalStyles, Title, Loader, Message } from './components';

export const App = () => {
  const { isLoading, data, error } = useGetUsersQuery();

  return (
    <div>
      <GlobalStyles />
      <Title text='React with TS - Fetching 04 - RTK' />
      {isLoading && <Loader />}
      {!isLoading && error && <Message type='error' text={JSON.stringify(error, null)} />}
      {!isLoading && !error ? (
        data ? (
          <ul>
            {data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <Message type='error' text='No users yet...' />
        )
      ) : null}
    </div>
  );
};
```

---

## Author: Newman Ferrer

newmanferrer@gmail.com

:sun_with_face: Maracaibo - Venezuela :venezuela:

Practice date: 19/05/2022
