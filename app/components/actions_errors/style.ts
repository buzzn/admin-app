import styled from 'styled-components';

export const ErrorsWrapper = styled.div`
  color: red;
  .action {
    text-transform: uppercase;
  }
  .error {
    animation: blinker 1s ease-out infinite;
  }
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;
