import { useAppSelector } from '../../hooks';
import { UserItem } from '../';
import { UlStyled } from './StyledComponents';

export const UsersList = () => {
  const { users } = useAppSelector(state => state.users);
  const { search } = useAppSelector(state => state.search);

  return (
    <UlStyled>
      {users
        .filter(
          user =>
            user.id.toLowerCase().includes(search.toLowerCase()) ||
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
        .map(user => (
          <UserItem key={user.id} user={user} />
        ))}
    </UlStyled>
  );
};
