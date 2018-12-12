import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Billings from 'billings';
import { SpanClick } from 'components/style';
import AddBilling from '../add_billing';

class BillingsList extends React.Component<ExtProps, ComponentState> {
  state = { isOpen: false };

  switchAddBilling = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addBilling = (params) => {
    // @ts-ignore
    const { addBilling, groupId, contractId } = this.props;

    return new Promise((resolve, reject) => {
      addBilling({ resolve, reject, params, groupId, contractId });
    }).then((res) => {
      this.switchAddBilling();
      return res;
    });
  };

  componentDidMount() {
    // @ts-ignore
    const { loadBillings, groupId, contractId } = this.props;
    loadBillings({ groupId, contractId });
  }

  render() {
    // @ts-ignore
    const { validationRules } = this.props;
    const { isOpen } = this.state;

    return (
      <div className="p-0">
        <SpanClick onClick={this.switchAddBilling} className="float-right" data-cy="add billing CTA">
          <FormattedMessage id="admin.billings.addNew" /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <AddBilling
          {...{
            toggle: this.switchAddBilling,
            isOpen,
            validationRules: validationRules.billingCreate,
            onSubmit: this.addBilling,
          }}
        />
        <br />
      </div>
    );
  }
}

interface ExtProps {
  groupId: string;
  contractId: string;
}

interface ComponentState {
  isOpen: boolean;
}

function mapStateToProps(state) {
  return {
    billings: state.billings.billings,
    loading: state.billings.loadingBillings,
    validationRules: state.billings.validationRules,
  };
}

export default connect(
  mapStateToProps,
  {
    addBilling: Billings.actions.addBilling,
    loadBillings: Billings.actions.loadBillings,
  },
)(BillingsList);
