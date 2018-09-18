import styled from 'styled-components';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

export const ContractHeader = styled(Row)`
  border-radius: 8px;
  background-color: #f5f5f5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
`;

export const InnerRow = styled(Row)`
  height: 80px;
`;

export const InnerBorderRow = styled(InnerRow)`
  border-bottom: 1px #e0e0e0 solid;
`;

export const BorderCol = styled(Col)`
  border-right: 1px #e0e0e0 solid;
`;

export const LinkCol = styled(Col)`
  padding: 20px 0 20px 20px;
`;

export const StatusCol = styled(Col)`
  padding: 30px 20px 20px 20px;
`;

export const TypeCol = styled(Col)`
  padding: 20px 20px 20px 16px;
`;

export const BigSpan = styled.span`
  font-size: 1.5rem;
  color: #2f2f2f;
  display: block;
`;

export const BigLink = styled(Link)`
  font-size: 1.5rem;
  color: #2f2f2f;
  display: block;
`;

export const LinkType = styled.span`
  font-size: 0.625rem;
  color: #9e9e9e;
  display: block;
  line-height: 10px;
`;
