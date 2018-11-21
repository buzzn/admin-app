import styled from 'styled-components';

export const EditOverlay = styled.div`
  opacity: 0.8;
  background: black;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  cursor: not-allowed;
`;

export const VersionMismatch = styled.div`
  background-color: #ff9800;
  padding: 40px 100px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin: 0 -16px;
`;
