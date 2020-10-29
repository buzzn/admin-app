import styled from 'styled-components';

export const StatusIcon = styled.div`
  border-radius: 5px;
  line-height: 20px;
  padding: 0 10px;
  display: inline-block;
  color: rgba(0,0,0, 0.3);
  font-weight: bold;
  border-radius: 10px;
  text-transform: uppercase;
  font-size: 12px;
  background-color: ${ props => props.active ? 'rgb(18, 233, 29)' : '#ccc'};
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
    margin: 0 0 1em;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    li {

    }
  }
`;


export const DocumentList = styled.div`
  ul {
    list-style: none;
    margin: 0;
    padding: 0 20px 0 0;
    li {
      margin: 0 0 0.5em;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      width: 100%;
      display: block;
      line-height: 1.4;
    }
  }
`

export const ResponseOutputBox = styled.div`
padding: 20px;
border: 1px solid #ff000055;
background: #ff000055;
color: #ff0000;
font-weight: bold;
ul {
  list-style: none;
  margin: 0;
  padding: 0 20px 0 0;
  li {
    margin: 0 0 0.5em;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    width: 100%;
    display: block;
    line-height: 1.4;
  }
}
`

