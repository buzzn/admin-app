import styled from 'styled-components';
import { Nav } from 'reactstrap';

export const CenterContent = styled.div``;

export const SubNav = styled(Nav)`
  border-bottom: #e0e0e0 solid 1px;
  margin-bottom: 2rem;
  .nav-link {
    text-transform: uppercase;
    color: #9e9e9e;
    font-weight: bold;
    &.active {
      color: black;
      border-bottom: black solid 1px;
    }
  }
`;

export const LargeAvatar = styled.img`
  width: 192px;
  height: 192px;
  border-radius: 50%;
`;

export const SpanClick = styled.span`
  cursor: pointer;
`;

export const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  .rw-widget-container {
    border: none;
    border-radius: 0;
  }
  .rw-widget-container.rw-state-focus,
  .rw-state-focus > .rw-widget-container,
  .rw-widget-container.rw-state-focus:hover,
  .rw-state-focus > .rw-widget-container:hover {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .rw-widget-picker {
    height: 3rem;
    input {
      padding-top: 1rem;
    }
    input:focus {
      border-right: none;
      padding-left: 0.5rem;
    }
    input:focus + span {
      border-right: solid 3px black;
      border-bottom: solid 1px black;
      .rw-btn-select {
        margin-right: -0.2rem;
      }
    }
  }
  .rw-select-bordered {
    border-left: none;
    border-bottom: solid 1px #e0e0e0;
    background: #f5f5f5;
    .rw-btn-select {
      margin-top: -1rem;
    }
  }
  .rw-widget-input,
  .rw-filter-input {
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  label {
    position: absolute;
    font-weight: normal;
    top: 0;
    padding: 15px 0 0 13px;
    transition: all 200ms;
    opacity: 0.5;
  }
  input {
    background: #f5f5f5;
    border: none;
    border-bottom: solid 1px #e0e0e0;
    border-radius: 0;
    padding-top: 1.4rem;
    height: 3rem;
  }
  input:focus {
    padding-left: 0.8rem;
    background: #f5f5f5;
    border-left: solid 3px black;
    border-right: solid 3px black;
    border-bottom: solid 1px black;
  }
  label.top {
    font-size: 75%;
    transform: translate3d(0, -36%, 0);
  }
`;
