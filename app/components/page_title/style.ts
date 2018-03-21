import styled from 'styled-components';
import { Row } from 'reactstrap';

interface HeaderProps {
  thin?: string;
}

export const CenterContentHeader = styled(Row)`
  box-shadow: 0 12px 8px -8px rgba(0, 0, 0, 0.1);
  margin: 0 -3rem ${({ thin }: HeaderProps) => (thin === 'true' ? '0' : '20px')} -3rem;
  padding: 20px 32px;
`;

export const Title = styled.span`
  font-weight: 700;
  line-height: 1.1;
  color: inherit;
  font-size: 1.5rem;
`;
