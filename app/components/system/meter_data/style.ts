import styled from 'styled-components';
import { Row } from 'reactstrap';

export const MeterHeader = styled(Row)`
  border-radius: 8px;
  background-color: #f5f5f5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-transform: uppercase;
  .value {
    color: #000000;
    font-size: 1.5rem;
    line-height: 27px;
  }
  .label {
    color: #afafaf;
    font-size: 0.625rem;
    line-height: 11px;
  }
`;

export const MeterTitle = styled.h5`
  margin-top: 3rem;
`;

interface MeterFormProps {
  editMode: boolean;
}

export const MeterForm = styled.div`
  ${({ editMode }: MeterFormProps) =>
    (editMode
      ? `
  z-index: 3000;
  position: relative;
  background-color: white;
  margin-left: -32px;
  padding-left: 32px;
  margin-right: -32px;
  padding-right: 32px;
  box-shadow: 0 2px 32px 0 rgba(0,0,0,0.62);
  `
      : '')}
  .side-buttons {
    position: absolute;
    right: -248px;
    top: 20%;
    height: 72px;
    width: 248px;
    border-radius: 0 100px 100px 0;
    background-color: #ffffff;
    padding-top: 14px;
    padding-left: 20px;
    /* box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.62); */
  }
`;
