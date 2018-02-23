import styled from 'styled-components';
import { Nav } from 'reactstrap';

export const CenterContent = styled.div``;

export const SubNav = styled(Nav)`
  border-bottom: #e0e0e0 solid 1px;
  margin-bottom: 2rem;
  .nav-link {
    text-transform: uppercase;
    color: #9e9e9e;
    font-weight: bold;
    &.active {
      color: black;
      border-bottom: black solid 1px;
    }
  }
`;

export const LargeAvatar = styled.img`
  width: 192px;
  height: 192px;
  border-radius: 50%;
`;
