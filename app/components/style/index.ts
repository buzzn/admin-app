import styled from 'styled-components';
import { Nav } from 'reactstrap';

export const CenterContent = styled.div`
  position: relative;
`;

export const FormTitle = styled.h5`
  margin-top: 2rem;
  padding-top: 1rem;
  i {
    float: right;
  }
`;

export const SubNavAddLink = styled.span`
  position: absolute;
  right: 0;
`;

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

export const DeleteButton = styled.div`
  background-color: #d84315;
  border-color: #d84315;
  float: right;
  &:hover {
    background-color: #d84315;
  }
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
      padding-top: 0.2rem;
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
    background-color: #f5f5f5;
    .rw-btn-select {
      margin-top: -0.4rem;
    }
  }
  .rw-widget-input,
  .rw-filter-input {
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  label {
    pointer-events: none;
    position: absolute;
    font-weight: normal;
    top: 0;
    left: 0;
    padding: 15px 0 0 13px;
    transition: all 200ms;
    opacity: 0.5;
  }
  label.top {
    font-size: 75%;
    transform: translate3d(0, -36%, 0);
  }
  input,
  select {
    background-color: #f5f5f5;
    border: none;
    border-bottom: solid 1px #e0e0e0;
    border-radius: 0;
    padding-top: 0.8rem;
    height: 3.36rem !important;
    &.dirty {
      background-color: rgba(33, 211, 67, 0.1);
    }
    &.form-control-danger {
      background-color: rgba(255, 74, 0, 0.1);
    }
  }
  input:focus,
  select:focus {
    padding-left: 0.8rem;
    background-color: #f5f5f5;
    border-left: solid 3px black;
    border-right: solid 3px black;
    border-bottom: solid 1px black;
    &.dirty {
      background-color: rgba(33, 211, 67, 0.1);
    }
    &.form-control-danger {
      background-color: rgba(255, 74, 0, 0.1);
    }
  }
  .inline-error {
    color: #ff4a00;
    text-transform: uppercase;
    font-size: 0.6875rem;
    position: absolute;
    font-weight: normal;
    bottom: 0;
    right: 8px;
    pointer-events: none;
  }
  .error-icon {
    color: #ff4a00;
    position: absolute;
    font-weight: normal;
    font-size: 1.3rem;
    top: 4px;
    right: 16px;
    pointer-events: none;
  }
  .date-wrapper {
    &.dirty {
      .rw-widget-picker {
        input {
          background-color: rgba(33, 211, 67, 0.1);
        }
        .rw-select-bordered {
          background-color: rgba(33, 211, 67, 0.1);
        }
      }
    }
    &.form-control-danger {
      .rw-widget-picker {
        input {
          background-color: rgba(255, 74, 0, 0.1);
        }
        .rw-select-bordered {
          background-color: rgba(255, 74, 0, 0.1);
        }
      }
    }
  }
`;
