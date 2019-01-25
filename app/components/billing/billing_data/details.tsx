import * as React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import BillingCycles from 'billing_cycles';
import Loading from 'components/loading';
import BillingDetails from 'components/billing_details';

class Details extends React.Component<ExtProps & StateProps & DispatchProps, DetailsState> {
  state = { minHeight: 340 };

  componentDidMount() {
    const { loadBilling, billingId, groupId, billingCycleId } = this.props;
    loadBilling({ billingId, groupId, billingCycleId });
  }

  componentDidUpdate(prev) {
    const { loadBilling, billingId, groupId, billingCycleId, billing, close, setBilling } = this.props;

    if (billingId && billing._status && billing._status !== 200) {
      setBilling({ _status: null });
      close();
    }

    if (billingId && billingId !== prev.billingId) {
      const node = ReactDOM.findDOMNode(this) as HTMLElement;
      this.setState({ minHeight: node ? node.clientHeight : 290 });
      loadBilling({ billingId, groupId, billingCycleId });
    }
  }

  render() {
    const { close, loading, billing, marketLocation, billingId, groupId, history } = this.props;
    const { minHeight } = this.state;

    if (!billingId) return null;

    if (loading || billing._status === null) return <Loading {...{ minHeight, unit: 'px' }} />;
    if (billing._status && billing._status !== 200) return null;

    return (
      <BillingDetails {...{ billing, close, history, marketLocation, groupId }} />
    );
  }
}

interface StatePart {
  billingCycles: { loadingBilling: boolean; billing: { _status: null | number; [key: string]: any } };
}

interface DetailsState {
  minHeight: number;
}

interface ExtProps {
  close: () => void;
  billingId: null | number;
  groupId: string;
  billingCycleId: string;
  marketLocation: any;
  history: any;
  url: string;
}

interface StateProps {
  loading: boolean;
  billing: { _status: null | number; [key: string]: any };
}

interface DispatchProps {
  loadBilling: Function;
  setBilling: Function;
}

function mapStateToProps(state: StatePart) {
  return { loading: state.billingCycles.loadingBilling, billing: state.billingCycles.billing };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadBilling: BillingCycles.actions.loadBilling,
  setBilling: BillingCycles.actions.setBilling,
})(Details);
