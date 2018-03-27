import styled from 'styled-components';
import { Card } from 'reactstrap';

export const StyledCard = styled(Card)`
  max-width: 479px;
  max-height: 375px;
  border-radius: 32px;
  margin-bottom: 30px !important;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  border: none;
  .group-info {
    width: 100%;
    height: 279px;
    border-radius: 32px;
    position: relative;
    .group-name {
      font-size: 1.5rem;
      font-weight: bold;
      position: absolute;
      left: 20px;
      top: 220px;
      color: white;
    }
    .group-types {
      color: white;
      position: absolute;
      top: 220px;
      right: 40px;
      i {
        margin-left: 10px;
      }
    }
  }
  .group-stats {
    width: 100%;
    height: 96px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .stats-left,
    .stats-right {
      display: flex;
    }
    .stats-right {
      .group-stat {
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .group-stat {
      text-align: center;
      margin-right: 20px;
      .value {
        color: #2f2f2f;
        font-size: 1.5rem;
        line-height: 28px;
      }
      .unit {
        color: #2f2f2f;
        font-size: 0.625rem;
      }
      .label {
        color: #9e9e9e;
        font-size: 0.625rem;
        text-transform: uppercase;
      }
    }
  }
  .hover-overlay {
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 32px;
    z-index: 10;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
    .view-details {
      color: #f5f5f5;
      font-size: 0.8125rem;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      background: black;
      padding: 10px 20px;
      border-radius: 20px;
      position: absolute;
      top: 69%;
      left: 36%;
    }
  }
`;
