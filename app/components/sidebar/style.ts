import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarBlock = styled.div`
  z-index: 1;
  position: fixed;
  overflow-y: scroll;
  top: 0rem;
  bottom: 0rem;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Dummy = styled.div`
  background-color: #2f2f2f;
  height: 72px;
`;

export const SidebarLink = styled(NavLink)`
  display: block;
  background-color: #2f2f2f;
  height: 72px;
  color: white;
  text-align: center;
  text-transform: uppercase;
  &:hover {
    background-color: black;
    color: white;
  }
  &.active {
    background-color: white;
    color: black;
  }
`;

export const SidebarText = styled.div`
  font-size: 0.75rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarIcon = styled.div`
  margin: 17px auto;
`;
