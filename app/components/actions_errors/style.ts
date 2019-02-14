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
    12% {
      opacity: 1;
    }
    16% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    32% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    44% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
`;
