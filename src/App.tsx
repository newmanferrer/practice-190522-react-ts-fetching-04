import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './hooks';
import { getUsers, setSuccessMessage } from './redux/features/users';
import { GlobalStyles, Title, Loader, Message, UsersList, UserForm, SearchForm } from './components';

export const App = () => {
  const { isLoading, users, successMessage, errorMessage } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [getUsers, dispatch]);

  if (successMessage) {
    setTimeout(() => dispatch(setSuccessMessage('')), 3000);
  }

  return (
    <>
      <GlobalStyles />
      <Title text='React with TS - Fetching 04 - RTK' />
      <UserForm />
      <SearchForm />
      {isLoading && <Loader />}
      {!isLoading && !errorMessage && successMessage && <Message type='success' text={successMessage} />}
      {!isLoading && errorMessage && <Message type='error' text={errorMessage} />}
      {!isLoading && !errorMessage ? (
        users.length ? (
          <UsersList />
        ) : (
          !successMessage && <Message type='error' text='No users yet...' />
        )
      ) : null}
    </>
  );
};
