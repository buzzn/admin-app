import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import Register from './register';

export class List extends Component {
  componentWillMount() {
    const { meterId, meterType, loadRegisters } = this.props;
    loadRegisters({ meterId, meterType });
  }

  render() {
    const { registers } = this.props;

    return (
      <div>
        { registers.map(register => (
          <Register key={ register.id } register={ register } />
        ))
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    registers: state.registers.registers,
  };
}

export default connect(mapStateToProps, { loadRegisters: actions.loadRegisters })(List);
