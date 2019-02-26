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
  /* box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1); */
  background: white;
`;

interface BarStyleProps {
  width: number;
  transparent?: boolean;
  status?: 'default' | 'open' | 'calculated' | 'documented' | 'queued' | 'delivered' | 'settled' | 'void' | 'closed';
  contractType?:
    | 'default'
    | 'contract_localpool_power_taker'
    | 'contract_localpool_third_party'
    | 'contract_localpool_gap';
  narrow?: boolean;
}

const barColors = {
  contract_localpool_third_party: {
    bg: 'rgba(175,175,175,0.5)',
    border: '#9E9E9E',
    stripes:
      'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 16px, rgba(175,175,175,0.75) 4px, rgba(175,175,175,0.75) 18px)',
  },
};

// TODO: extract to config;
const billingStatuses = {
  open: { color: '#00BCD4' },
  calculated: { color: '#FDD835' },
  documented: { color: '#F57C00' },
  queued: { color: '#D4E157' },
  delivered: { color: '#000000' },
  settled: { color: '#21D343' },
  void: { color: '#D84315' },
  closed: { color: '#8C8C8C' },
  default: { color: '#8C8C8C' },
};
const contractTypes = {
  contract_localpool_power_taker: { alpha: 0.25 },
  contract_localpool_gap: { alpha: 0.5 },
};
barColors['default'] = Object.keys(billingStatuses).reduce(
  (res, key) => ({ ...res, [key]: { bg: 'transparent', border: 'none' } }),
  {},
);
const hexToRgbA = (hex, alpha) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
  }
  throw new Error('Bad Hex');
};
Object.keys(contractTypes).forEach((contractType) => {
  barColors[contractType] = Object.keys(billingStatuses).reduce(
    (res, key) => ({
      ...res,
      [key]: {
        border: billingStatuses[key].color,
        bg: hexToRgbA(billingStatuses[key].color, contractTypes[contractType].alpha),
      },
    }),
    {},
  );
});

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
    cursor: ${({ contractType }: BarStyleProps) => (contractType === 'contract_localpool_third_party' ? 'auto' : 'pointer')};
    background-color: ${({ status = 'default', contractType = 'default' }: BarStyleProps) => (contractType === 'contract_localpool_third_party'
    ? barColors[contractType].bg
    : barColors[contractType][status].bg)};
    background-image: ${({ contractType }: BarStyleProps) => (contractType !== 'contract_localpool_third_party' ? 'none' : barColors.contract_localpool_third_party.stripes)};
    border-left: 1px solid
      ${({ status = 'default', contractType = 'default' }: BarStyleProps) => (contractType === 'contract_localpool_third_party'
    ? barColors[contractType].border
    : barColors[contractType][status].border)};
    border-right: 1px solid
      ${({ status = 'default', contractType = 'default' }: BarStyleProps) => (contractType === 'contract_localpool_third_party'
    ? barColors[contractType].border
    : barColors[contractType][status].border)};

    &.selected {
      border: 2px solid
        ${({ status = 'default', contractType = 'default' }: BarStyleProps) => (contractType === 'contract_localpool_third_party'
    ? barColors[contractType].border
    : barColors[contractType][status].border)};
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
  width: 100%;
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
      width: 12.5%;
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

export const MassChangeBlock = styled.div`
  margin-top: 2rem;
  .kill-block {
    margin-top: 2rem;
  }
`;
