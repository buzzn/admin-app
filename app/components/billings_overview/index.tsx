import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Contracts from 'contracts';
import Loading from 'components/loading';

const BillingsOverview = ({
  loadGroupPowertakers,
  setGroupPowertakers,
  loading,
  powertakers,
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

  // should be
  // {
  //    [status]: [{ billing + contract }]
  // }
  // const statuses = powertakers.array
  //   .filter(p => !!p.billings && p.billings.array.length)

  return <div />;
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
  },
)(BillingsOverview);
