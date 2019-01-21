import styled from 'styled-components';

export const StatusWrapper = styled.div`
  border: 1px solid black;
  margin-top: 1.5rem;
  position: relative;
  .status-name {
    font-weight: bold;
    font-size: 1.2rem;
    text-transform: uppercase;
    background-color: white;
    display: inline-block;
    position: absolute;
    top: -1rem;
    left: 0;
  }
`;

export const BillingWrapper = styled.div`
  .billing-name {
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    border-bottom: 1px solid #e5e5e5;
  }
`;
