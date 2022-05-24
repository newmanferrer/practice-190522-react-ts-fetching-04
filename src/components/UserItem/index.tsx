import { useAppDispatch } from '../../hooks';
import { setUserToEdit, setIsUpdatePut, deleteUser } from '../../redux/features/users';
import { user } from '../../models';
import { LiStyled, H3Styled, H4Styled, ButtonsWrapper, ButtonStyled } from './StyledComponents';
import { COLORS } from '../../colors';

interface UserItemProps {
  user: user;
}

export const UserItem = ({ user }: UserItemProps) => {
  const { id, name, username, email } = user;
  const dispatch = useAppDispatch();

  const handleDelete = (user: user) => {
    const isConfirm = confirm(`The user with id: "${user.id}" and name: "${user.name}", will be deleted`);

    if (isConfirm) dispatch(deleteUser(user));
    else return;
  };

  return (
    <LiStyled>
      <H3Styled>{name}</H3Styled>
      <H4Styled>ID: {id}</H4Styled>
      <H4Styled>{username}</H4Styled>
      <H4Styled>{email}</H4Styled>

      <ButtonsWrapper>
        <ButtonStyled
          onClick={() => {
            dispatch(setIsUpdatePut(true));
            dispatch(setUserToEdit(user));
          }}
        >
          Update Put
        </ButtonStyled>
        <ButtonStyled
          onClick={() => {
            dispatch(setIsUpdatePut(false));
            dispatch(setUserToEdit(user));
          }}
        >
          Update Patch
        </ButtonStyled>
        <ButtonStyled colorHover={COLORS.white} bgHover={COLORS.error} onClick={() => handleDelete(user)}>
          Delete
        </ButtonStyled>
      </ButtonsWrapper>
    </LiStyled>
  );
};
