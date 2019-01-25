import styled from 'styled-components';

export const BillingDetailsWrapper = styled.div`
  .wrapper {
    padding: 1rem;
    height: 100%;
    .title {
      border-bottom: 1px solid #e0e0e0;
      width: 100%;
      margin-top: 3rem;
      padding-bottom: 1rem;
      &.top {
        margin-top: 3.5rem;
      }
    }
  }
`;

export const DoubleCell = styled.div`
  background-color: ${(props) => {
    return props.hasErr ? 'rgba(255, 0, 0, 0.2)' : '';
  }};
  div {
    height: 57px;
  }
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  height: 60px;
`;

export const ReadingAction = styled.span`
  cursor: pointer;
  text-decoration: underline;
`;

export const ErrCell = styled.div`
  background: rgba(255, 0, 0, 0.2);
  padding-left: 1rem;
`;
