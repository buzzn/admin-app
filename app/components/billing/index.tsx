import * as React from 'react';
import { connect } from 'react-redux';

class Billing extends React.Component<ExtProps & StateProps & DispatchProps> {
  render() {
    return <div />;
  }
}

interface StatePart {}

interface ExtProps {}

interface StateProps {}

interface DispatchProps {}

function mapStateToProps(state: StatePart) {
  return {};
}

export default connect<ExtProps, StateProps, DispatchProps>(mapStateToProps)(Billing);
