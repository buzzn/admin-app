import styled from 'styled-components';

export const FieldToggleWrapper = styled.span`
  display: inline-block;
  .field-toggle-switch {
    cursor: pointer;
    // text-indent: -9999px;
    width: 2.5rem;
    height: 1.5rem;
    background: #d8d8d8;
    border: none;
    border-radius: 0.75rem;
    display: block;
    position: relative;
    transition: 0.2s;
  }

  .field-toggle-switch:after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 1.125rem;
    height: 1.125rem;
    background: #ffffff;
    border-radius: 0.75rem;
    transition: 0.2s;
  }

  .field-toggle-switch.on {
    background: #21d343;
  }

  .field-toggle-switch.on:after {
    left: calc(100% - 21px);
    background-color: #ffffff;
  }
`;
