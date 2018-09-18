import styled from 'styled-components';
import { Row } from 'reactstrap';

export const InputRow = styled(Row)`
  i {
    position: absolute;
    right: 0.3rem;
    z-index: 10;
    cursor: pointer;
    font-size: 1rem;
  }
  i.add {
    color: #d4e157;
    top: 0.5rem;
  }
  i.remove {
    color: #ff4a00;
    top: 2rem;
  }
`;
