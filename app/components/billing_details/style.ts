import styled from 'styled-components';

export const BillingDetailsWrapper = styled.div`
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
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
    .edit-switch-wrap {
      position: relative;
      .edit-switch {
        position: absolute;
        right: 0;
        top: 0;
        margin-right: -1rem;
        z-index: 10;
      }
    }
  }
`;

export const DoubleCell = styled.div`
  background-color: ${props => (props.hasErr ? 'rgba(255, 0, 0, 0.2)' : '')};
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

export const DocumentsWrapper = styled.div`
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  margin: 1.5rem 0;
  padding: 1rem 0;
  .invoice-file, .invoice-date {
    font-weight: bold;
  }
  .invoice-file {
    cursor: pointer;
  }
`;
