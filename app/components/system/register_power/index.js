// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Registers from 'registers';

type Props = {
  registerId: string,
  groupId: string,
  loadRegisterPower: Function,
  registerPower: Object,
};

class RegisterPower extends React.Component<Props> {
  componentWillMount() {
    const { registerId, groupId, loadRegisterPower } = this.props;
    loadRegisterPower({ registerId, groupId });
  }

  render() {
    const { registerPower } = this.props;
    const prefix = 'admin.registers';
    const value = registerPower.value || '';

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
