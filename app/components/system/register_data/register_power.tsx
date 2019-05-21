import * as React from 'react';
import { connect } from 'react-redux';
import Registers from 'registers';
import { formatLabel } from '_util';

class RegisterPower extends React.Component<ExtProps & StateProps & DispatchProps> {
  componentDidMount() {
    const { registerId, groupId, loadRegisterPower, meterId } = this.props;
    loadRegisterPower({ registerId, groupId, meterId });
  }

  render() {
    const { registerPower, registerId } = this.props;

    let value = '';
    if (!registerPower[registerId] || registerPower[registerId]._status === 404 || registerPower[registerId]._status === 503) {
      value = '--.--';
    } else if (registerPower[registerId].value === -1) {
      value = '!!.!!';
    } else {
      value = formatLabel(registerPower[registerId].value || 0);
    }

    return (
      <div style={{ marginBottom: '2rem' }}>
        Power widget is completely broken.<br />
        <span style={{ fontSize: '2rem' }}>{value.split(' ')[0]}</span> {value.split(' ')[1]}
      </div>
    );
  }
}

interface StatePart {
  registers: { registerPower: { _status: null | number; [key: string]: any } };
}

interface ExtProps {
  registerId: string;
  groupId: string;
  meterId: string;
}

interface StateProps {
  registerPower: { _status: null | number; [key: string]: any };
}

interface DispatchProps {
  loadRegisterPower: Function;
}

function mapStateToProps(state: StatePart) {
  return { registerPower: state.registers.registerPower };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  { loadRegisterPower: Registers.actions.loadRegisterPower },
)(RegisterPower);
