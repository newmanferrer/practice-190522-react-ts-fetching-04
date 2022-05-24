import { MessageWrapper, MessageStyled } from './StyledComponents';

interface MessageProps {
  type?: 'success' | 'warn' | 'error';
  text: string;
}

export const Message = ({ type, text }: MessageProps) => {
  return (
    <MessageWrapper type={type}>
      <MessageStyled type={type}>{text}</MessageStyled>
    </MessageWrapper>
  );
};
