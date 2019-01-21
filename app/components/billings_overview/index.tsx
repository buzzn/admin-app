import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Contracts from 'contracts';
import Billings from 'billings';
import Loading from 'components/loading';
import Billing from './billing';
import BillingStatus from 'components/billing_status';
import { StatusWrapper } from './style';

interface ManageReadingInterface {
  attachReading: Function;
  groupId: string;
  contractId: string;
  billingId: string;
}

export const ManageReadingContext = React.createContext<ManageReadingInterface>({
  attachReading: () => false,
  groupId: '',
  contractId: '',
  billingId: '',
});

const BillingsOverview = ({
  loadGroupPowertakers,
  setGroupPowertakers,
  loading,
  powertakers,
  attachReading,
  match: { params: { groupId } },
}) => {
  useEffect(
    () => {
      loadGroupPowertakers({ groupId, withBillings: true });
      return () => setGroupPowertakers({ _status: null, array: [] });
    },
    [groupId],
  );

  if (powertakers._status === 404 || powertakers._status === 403) {
    setGroupPowertakers({ _status: null, array: [] });
    return <Redirect to="/groups" />;
  }

  if (powertakers._status === null || loading) return <Loading minHeight={40} />;

  const statuses = powertakers.array
    .filter(p => !!p.billings && p.billings.array.length)
    .flatMap(p => p.billings.array.map(b => ({ ...b, powertaker: { ...p, billings: null } })))
    .reduce((s, b) => ({ ...s, [b.status]: [...(s[b.status] || []), b] }), {});

  return (
    <React.Fragment>
      {['open', 'calculated', 'delivered', 'settled', 'closed'].map(status => (
        <StatusWrapper key={status}>
          <div className="status-name"><BillingStatus {...{ status, size: 'small' }} /> {status} billings:</div>
          <br />
          {(statuses[status] || []).map(billing => (
            <ManageReadingContext.Provider
              key={billing.id}
              value={{
                attachReading,
                groupId,
                contractId: billing.powertaker.id,
                billingId: billing.id,
              }}
            >
              <Billing {...{ billing }} />
            </ManageReadingContext.Provider>
          ))}
        </StatusWrapper>
      ))}
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(
  mapStateToProps,
  {
    loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
    setGroupPowertakers: Contracts.actions.setGroupPowertakers,
    attachReading: Billings.actions.attachReading,
  },
)(BillingsOverview);
