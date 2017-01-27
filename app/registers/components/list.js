import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import Register from './register';

export class List extends Component {
  static propTypes = {
    registers: React.PropTypes.array.isRequired,
    loadRegisters: React.PropTypes.func.isRequired,
    meterId: React.PropTypes.string,
    meterType: React.PropTypes.string,
    groupId: React.PropTypes.string,
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
