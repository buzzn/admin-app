import styled from 'styled-components';

export const ReportsWrap = styled.div`
  margin-top: 2rem;
  .controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export const ReportWrap = styled.div`
  .values-group {
    margin-top: 2rem;
    .values-row {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .field-name {
      font-weight: bold;
      &.important {
        font-size: 120%;
      }
    }
    .field-value {
      text-align: right;
    }
  }
`;
