import styled from 'styled-components';

export const StatusIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${ props => props.active ? 'rgb(18, 233, 29)' : '#d10019'};
  margin: 1em 5px;
`;

export const SwitchButton = styled.div`
  input {
    position: absolute;
    left: -9999em;
    opacity: 0;
    &:checked + label {
      &:before {
        background: rgb(18, 233, 29);
      }
      &:after {
        left: 13px;
      }
    }
  }
  label {
    padding-left: 40px;
    padding-right: 20px;
    position: relative;
    cursor: pointer;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 30px;
      height: 18px;
      border-radius: 9px;
      background: #ccc;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      top: 50%;
      transform: translate(0, -50%);
      left: 1px;
      transition: left 500ms ease;
    }
  }
`;

export const CheckButton = styled.div`
  input {
    position: absolute;
    left: -9999em;
    opacity: 0;
    &:checked + label {
      &:before {
        background: rgb(18, 233, 29);
      }
      &:after {
        transform: translate(0, -50%) scale(0.8);
      }
    }
  }
  label {
    padding-left: 28px;
    padding-right: 20px;
    position: relative;
    cursor: pointer;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 18px;
      height: 18px;
      background: #ccc;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      background: white;
      top: 50%;
      transform: translate(0, -50%) scale(0.5);
      left: 1px;
      transition: opacity 500ms ease, transform 500ms ease;
    }
  }
`;


export const ToolBar = styled.div`
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    li {

    }
  }
`;
