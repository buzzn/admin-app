import styled from 'styled-components';
import { Row } from 'reactstrap';

export const MeterHeader = styled(Row)`
  border-radius: 8px;
  background-color: #f5f5f5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-transform: uppercase;
  .value {
    color: #000000;
    font-size: 1.5rem;
    line-height: 27px;
  }
  .label {
    color: #afafaf;
    font-size: 0.625rem;
    line-height: 11px;
  }
`;
