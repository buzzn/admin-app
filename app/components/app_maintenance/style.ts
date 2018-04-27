import styled from 'styled-components';

export const MaintenanceWrapper = styled.div`
  background: transparent;
  height: 100vh;
  padding-top: calc(50vh - 15rem);
  position: relative;
  .background {
    background: #4dd0e1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .bubbles-wrapper {
    position: absolute;
    width: 80%;
    height: 100%;
    left: 10%;
    top: 0;
  }
  .maintenance {
    z-index: 100;
    position: absolute;
    width: 40%;
    height: 100%;
    left: 30%;
    top: 0;
  }
`;
