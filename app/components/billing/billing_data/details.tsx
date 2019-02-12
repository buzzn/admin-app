import * as React from 'react';
import ReactDOM from 'react-dom';
import BillingDetails from 'components/billing_details';

class Details extends React.Component<ExtProps, DetailsState> {
  state = { minHeight: 340 };

  componentDidUpdate(prev) {
    const { billingId } = this.props;

    if (billingId && billingId !== prev.billingId) {
      const node = ReactDOM.findDOMNode(this) as HTMLElement;
      this.setState({ minHeight: node ? node.clientHeight : 290 });
    }
  }

  render() {
    const { close, contractId, billingId, groupId, history } = this.props;
    const { minHeight } = this.state;

    if (!billingId || !contractId) return '';

    return <BillingDetails {...{
      minHeight,
      close,
      groupId,
      contractId,
      billingId,
      history,
 }} />;
  }
}

interface DetailsState {
  minHeight: number;
}

interface ExtProps {
  close: () => void;
  billingId: null | number;
  groupId: string;
  contractId: string;
  history: any;
}

export default Details;
