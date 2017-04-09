import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from '../actions';
import Register from './register';

export class List extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    loadRegisters: PropTypes.func.isRequired,
    meterId: PropTypes.string,
    meterType: PropTypes.string,
    groupId: PropTypes.string,
  };

  static defaultProps = {
    registers: [],
  };

  componentWillMount() {
    const { meterId, meterType, groupId, loadRegisters } = this.props;
    loadRegisters({ meterId, meterType, groupId });
  }

  render() {
    const { registers } = this.props;

    return (
      <div>
        <h5>Registers:</h5>
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
