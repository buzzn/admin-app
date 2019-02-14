import styled from 'styled-components';

export const ItemDetailsWrapper = styled.div`
  border: 1px solid #e5e5e5;
  padding: 5px;
  margin-top: 5px;
  .sub-header {
    font-weight: bold;
    font-size: 18px;
    margin-top: 5px;
  }
`;

export const ItemErrors = styled.span`
  color: red;
  font-weight: bold;
`;

export const ReadingAction = styled.span`
  cursor: pointer;
  text-decoration: underline;
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  height: 60px;
`;
