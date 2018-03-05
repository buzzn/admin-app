import styled from 'styled-components';

export const MaLoListHeader = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  .name {
    width: 20%;
    font-weight: bold;
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
      height: 50%;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      .begin {
        padding-left: 4px;
      }
      .end {
        padding-right: 4px;
      }
    }
    .months {
      display: flex;
      height: 50%;
      border-right: 1px solid #e0e0e0;
      background-size: 8.333% 100%;
      background-image: repeating-linear-gradient(to right, #e0e0e0, #e0e0e0 1px, transparent 1px, transparent 100%);
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
    padding-top: 10%;
    width: 80%;
    height: 100%;
    border-right: 1px solid #e0e0e0;
    background-size: 8.333% 100%;
    background-image: repeating-linear-gradient(to right, #e0e0e0, #e0e0e0 1px, transparent 1px, transparent 100%);
  }
`;

interface BrickStyleProps {
  width: number;
  transparent?: boolean;
  status?: 'open' | 'closed';
  contractType?: 'power_taker' | 'gap';
}

export const Brick = styled.div`
  width: ${({ width }: BrickStyleProps) => width}%;
  height: 90%;
  background-color: ${({ transparent, status }: BrickStyleProps) =>
    (transparent ? 'transparent' : status === 'open' ? 'rgba(0,188,212,0.25)' : 'rgba(175,175,175,0.5)')};
  background-image: ${({ contractType, status }: BrickStyleProps) =>
    (contractType !== 'gap'
      ? 'none'
      : status === 'open'
        ? 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 16px, rgba(0,188,212,0.75) 4px, rgba(0,188,212,0.75) 18px)'
        : 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 16px, rgba(175,175,175,0.75) 4px, rgba(175,175,175,0.75) 18px)')};
  border-left: 1px solid
    ${({ transparent, status }: BrickStyleProps) =>
    (transparent ? 'none' : status === 'open' ? 'rgba(0,188,212,0.9)' : 'rgba(175,175,175,0.9)')};
  border-right: 1px solid
    ${({ transparent, status }: BrickStyleProps) =>
    (transparent ? 'none' : status === 'open' ? 'rgba(0,188,212,0.9)' : 'rgba(175,175,175,0.9)')};
`;

export const Legend = styled.div`
  width: 50%;
  margin-top: 4rem;
  margin-bottom: 4rem;
  .title {
    font-weight: bold;
    font-size: 1.4rem;
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
  }
  .rw {
    display: flex;
    height: 37px;
    > div {
      width: 33.333%;
    }
  }
`;
