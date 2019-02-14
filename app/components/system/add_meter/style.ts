import styled from 'styled-components';
import { Row } from 'reactstrap';

export const InputRow = styled(Row)`
  position: relative;
  border-top: 1px solid grey;
  padding-top: 2rem;
  i {
    position: absolute;
    top: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
  }
  i.add {
    color: #d4e157;
    right: 0.3rem;
  }
  i.remove {
    color: #ff4a00;
    right: 1.5rem;
  }
`;

export const PadRow = styled.div`
  height: 3rem;
`;

export const RegisterFormWrapper = styled.div`
  .col-3, .col-4, .col-xl-2, .col-xl-3 {
    padding-left: 6px;
    padding-right: 6px;
  }
`;
