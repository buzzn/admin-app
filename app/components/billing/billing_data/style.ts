import styled from 'styled-components';
import { UnmountClosed } from 'react-collapse';

export const MaLoListHeader = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  .name {
    width: 20%;
    font-weight: bold;
    font-size: 0.8rem;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
  .labels {
    display: flex;
    flex-direction: column;
    width: 80%;
    .dates {
      display: flex;
      justify-content: space-between;
      height: 70%;
      border-left: 1px solid #e0e0e0;
      box-shadow: 0px 0px 0px 0px #e0e0e0, 1px 0px 0px 0px #e0e0e0;
      .begin {
        padding-left: 4px;
      }
      .end {
        padding-right: 4px;
      }
      .fa {
        color: #bdbdbd;
      }
    }
    .months {
      display: flex;
      height: 30%;
      color: #9e9e9e;
      text-transform: uppercase;
      font-size: 0.625rem;
      position: relative;
      .grid-line {
        position: absolute;
        height: 100%;
        width: 1px;
        background: #eeeeee;
        z-index: -1;
      }
      .month {
        position: absolute;
        padding-left: 4px;
        padding-right: 4px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;

export const MaLoRow = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid #e0e0e0;
  .name {
    width: 20%;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .bars {
    display: flex;
    width: 80%;
    height: 100%;
    position: relative;
    .grid-line {
      position: absolute;
      height: 100%;
      width: 1px;
      background: #eeeeee;
      z-index: -1;
    }
  }
`;

export const DetailsWrapper = styled(UnmountClosed)`
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  background: white;
`;

export const BillingDetails = styled.div`
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

interface BarStyleProps {
  width: number;
  transparent?: boolean;
  status?: 'open' | 'closed';
  contractType?: 'power_taker' | 'third_party' | 'gap';
  narrow?: boolean;
}

const barColors = {
  default: {
    open: { bg: 'transparent', border: 'none' },
    closed: { bg: 'transparent', border: 'none' },
    default: { bg: 'transparent', border: 'none' },
  },
  power_taker: {
    open: {
      bg: 'rgba(0,188,212,0.25)',
      border: '#00BCD4',
    },
    closed: {
      bg: 'rgba(175,175,175,0.25)',
      border: '#8C8C8C',
    },
  },
  gap: {
    open: {
      bg: 'rgba(0,188,212,0.5)',
      border: '#00BCD4',
    },
    closed: {
      bg: 'rgba(158,158,158,0.5)',
      border: '#8C8C8C',
    },
  },
  third_party: {
    bg: 'rgba(175,175,175,0.5)',
    border: '#9E9E9E',
    stripes:
      'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 16px, rgba(175,175,175,0.75) 4px, rgba(175,175,175,0.75) 18px)',
  },
};

export const Bar = styled.div`
  width: ${({ width }: BarStyleProps) => width}%;
  height: 100%;
  padding-top: 8px;

  .bar-bg {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80%;
    position: relative;
    background-color: ${({ status = 'default', contractType = 'default' }: BarStyleProps) =>
    (contractType === 'third_party' ? barColors[contractType].bg : barColors[contractType][status].bg)};
    background-image: ${({ contractType }: BarStyleProps) =>
    (contractType !== 'third_party' ? 'none' : barColors.third_party.stripes)};
    border-left: 1px solid
      ${({ status = 'default', contractType = 'default' }: BarStyleProps) =>
    (contractType === 'third_party' ? barColors[contractType].border : barColors[contractType][status].border)};
    border-right: 1px solid
      ${({ status = 'default', contractType = 'default' }: BarStyleProps) =>
    (contractType === 'third_party' ? barColors[contractType].border : barColors[contractType][status].border)};

    &.selected {
      border: 2px solid
        ${({ status = 'default', contractType = 'default' }: BarStyleProps) =>
    (contractType === 'third_party' ? barColors[contractType].border : barColors[contractType][status].border)};
      :after {
        content: '';
        position: absolute;
        top: calc(100% - 8px);
        left: calc(50% - 11px);
        width: 0;
        height: 0;
        border-bottom: solid 11px white;
        border-left: solid 11px transparent;
        border-right: solid 11px transparent;
      }
      .info {
        padding-top: calc(${({ narrow }: BarStyleProps) => (narrow ? 0.35 : 0.8)}rem - 2px);
      }
    }

    .info {
      color: ${({ status }: BarStyleProps) => (status === 'open' ? '#00BCD4' : '#9E9E9E')};
      font-size: 0.8rem;
      padding-top: ${({ narrow }: BarStyleProps) => (narrow ? 0.35 : 0.8)}rem;
      line-height: 0.8rem;
      display: flex;
      flex-direction: ${({ narrow }: BarStyleProps) => (narrow ? 'column' : 'row')};
      text-align: ${({ narrow }: BarStyleProps) => (narrow ? 'center' : 'left')};
      .price {
        font-weight: bold;
        margin-right: 6px;
        width: 100%;
      }
      .energy {
        width: 100%;
      }
    }
    .error {
      color: red;
      font-size: 1rem;
      padding-top: 6px;
      padding-right: 6px;
    }
  }
`;

export const Legend = styled.div`
  width: 50%;
  margin-top: 4rem;
  margin-bottom: 4rem;
  .title {
    font-weight: bold;
    font-size: 1.2rem;
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .rw {
    display: flex;
    height: 37px;
    > div {
      width: 33.333%;
    }
    .label {
      text-transform: uppercase;
      font-size: 0.625rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`;

export const DoubleCell = styled.div`
  div {
    height: 57px;
  }
`;
