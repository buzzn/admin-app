import styled from 'styled-components';

interface WrapperProps {
  editMode: boolean;
}

export const Wrapper = styled.div`
  ${({ editMode }: WrapperProps) =>
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
    height: 72px;
    width: 248px;
    border-radius: 0 100px 100px 0;
    background-color: #ffffff;
    padding-top: 14px;
    padding-left: 20px;
    transition: all 0.7s ease 0s;
    /* box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.62); */
  }
`;
