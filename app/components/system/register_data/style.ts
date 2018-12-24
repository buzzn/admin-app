import styled from 'styled-components';
import { Row } from 'reactstrap';

export const ReadingDetailsWrapper = styled(Row)`
  background-color: '#F5F5F5';
  box-shadow: inset 0 1px 8px 0 rgba(0, 0, 0, 0.07);
  padding: 20px 10px;
  margin: 0;
  position: relative;
  .delete-reading {
    position: absolute;
    right: 4px;
    top: 4px;
    cursor: pointer;
    color: red;
    font-size: 1rem;
  }
`;
