import styled from 'styled-components';

interface GridStyleProps {
  ticks: Array<number>;
}

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
      border-right: 1px solid #e0e0e0;
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
      border-right: 1px solid #e0e0e0;
      border-left: 1px solid #e0e0e0;
      background: linear-gradient(
        to right,
        ${({ ticks }: GridStyleProps) =>
    ticks.map((t, i) =>
      `${i !== 0 ? `white calc(${t}%),` : ''}#eeeeee calc(${t}% + 1px), white calc(${t}% + 2px)${
        i < ticks.length - 1 ? ',' : ''
      }`)}
      );
      background: -moz-linear-gradient(
        to right,
        ${({ ticks }: GridStyleProps) =>
    ticks.map((t, i) =>
      `${i !== 0 ? `white calc(${t}%),` : ''}#eeeeee calc(${t}% + 1px), white calc(${t}% + 4px)${
        i < ticks.length - 1 ? ',' : ''
      }`)}
      );
      .month {
        width: 25%;
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
  border-bottom: 1px solid #e0e0e0;
  .name {
    width: 20%;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .bricks {
    display: flex;
    width: 80%;
    height: 100%;
    border-right: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    background: linear-gradient(
      to right,
      ${({ ticks }: GridStyleProps) =>
    ticks.map((t, i) =>
      `${i !== 0 ? `white calc(${t}%),` : ''}#eeeeee calc(${t}% + 1px), white calc(${t}% + 2px)${
        i < ticks.length - 1 ? ',' : ''
      }`)}
    );
    background: -moz-linear-gradient(
      to right,
      ${({ ticks }: GridStyleProps) =>
    ticks.map((t, i) =>
      `${i !== 0 ? `white calc(${t}%),` : ''}#eeeeee calc(${t}% + 1px), white calc(${t}% + 4px)${
        i < ticks.length - 1 ? ',' : ''
      }`)}
    );
  }
`;

interface BrickStyleProps {
  width: number;
  transparent?: boolean;
  status?: 'open' | 'closed';
  contractType?: 'power_taker' | 'third_party' | 'gap';
}

const brickColors = {
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
    open: {
      bg: 'rgba(175,175,175,0.5)',
      border: '#9E9E9E',
      stripes:
        'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 16px, rgba(175,175,175,0.75) 4px, rgba(175,175,175,0.75) 18px)',
    },
    closed: {
      bg: 'rgba(175,175,175,0.5)',
      border: '#9E9E9E',
      stripes:
        'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 16px, rgba(175,175,175,0.75) 4px, rgba(175,175,175,0.75) 18px)',
    },
  },
};

export const Brick = styled.div`
  width: ${({ width }: BrickStyleProps) => width}%;
  height: 100%;
  padding-top: 9px;

  > div {
    width: 100%;
    height: 80%;
    background-color: ${({ status, contractType }: BrickStyleProps) =>
    brickColors[contractType || 'default'][status || 'default'].bg};
    background-image: ${({ contractType }: BrickStyleProps) =>
    (contractType !== 'third_party' ? 'none' : brickColors.third_party.open.stripes)};
    border-left: 1px solid
      ${({ status, contractType }: BrickStyleProps) =>
    brickColors[contractType || 'default'][status || 'default'].border};
    border-right: 1px solid
      ${({ status, contractType }: BrickStyleProps) =>
    brickColors[contractType || 'default'][status || 'default'].border};
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
