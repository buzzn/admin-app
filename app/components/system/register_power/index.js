// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Registers from 'registers';
import { formatLabel } from '_util';

type Props = {
  registerId: string,
  groupId: string,
  meterId: string,
  loadRegisterPower: Function,
  registerPower: Object,
};

class RegisterPower extends React.Component<Props> {
  componentWillMount() {
    const { registerId, groupId, loadRegisterPower, meterId } = this.props;
    loadRegisterPower({ registerId, groupId, meterId });
  }

  render() {
    const { registerPower } = this.props;
    const prefix = 'admin.registers';

    let value = '';
    if (registerPower.status === 404) {
      value = '--.--';
    } else if (registerPower.value === -1) {
      value = '!!.!!';
    } else {
      value = formatLabel(registerPower.value || 0);
    }

    return (
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '2rem' }}>{ value.split(' ')[0] }</span> { value.split(' ')[1] }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    registerPower: state.registers.registerPower,
  };
}

export default connect(mapStateToProps, {
  loadRegisterPower: Registers.actions.loadRegisterPower,
})(RegisterPower);
