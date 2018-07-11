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
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: 0 2px 32px 0 rgba(0,0,0,0.62);
  `
      : '')}
  .side-buttons {
    position: absolute;
    right: -278px;
    height: 72px;
    minWidth: 278px;
    border-radius: 0 100px 100px 0;
    background-color: #ffffff;
    padding: 14px 20px 0px 60px;
    transition: all 0.7s ease 0s;
  }
`;
