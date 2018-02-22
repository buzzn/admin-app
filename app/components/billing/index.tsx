import * as React from 'react';
import { connect } from 'react-redux';
import BillingCycles from 'billing_cycles';
import BillingList from './billing_list';

class Billing extends React.Component<ExtProps & StateProps & DispatchProps> {
  componentDidMount() {
    const { loadBillingCycles, match: { params: { groupId } } } = this.props;
    loadBillingCycles(groupId);
  }

  render() {
    return <div />;
  }
}

interface StatePart {}

interface ExtProps {}

interface StateProps {}

interface DispatchProps {}

function mapStateToProps(state: StatePart) {
  return {
    billingCycles: state.billingCycles.billingCycles,
    loading: state.billingCycles.loadingBillingCycles,
  };
}

export default connect<ExtProps, StateProps, DispatchProps>(mapStateToProps, {
  loadBillingCycles: BillingCycles.actions.loadBillingCycles,
  setBillingCycles: BillingCycles.actions.setBillingCycles,
})(Billing);
