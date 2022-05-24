import { TitleStyled } from './StyledComponents';

interface TitleProps {
  text: string;
  size?: string;
}

export const Title = ({ text, size }: TitleProps) => {
  return <TitleStyled size={size}>{text}</TitleStyled>;
};
