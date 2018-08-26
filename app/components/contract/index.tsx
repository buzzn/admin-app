import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import get from 'lodash/get';
import Contracts from 'contracts';
import Loading from 'components/loading';
import PowertakerContract from './powertaker';
import ThirdPartyContract from './third_party';
import LPCContract from './localpool_processing';

class Contract extends React.Component<ExtProps & DispatchProps & StateProps> {
  componentDidMount() {
    const { loadContract, groupId, contractId } = this.props;
    loadContract({ groupId, contractId });
  }

  componentWillUnmount() {
    this.props.setContract({ contract: { _status: null }, contractor: { _status: null }, customer: { _status: null } });
  }

  render() {
    const { loading, contract, contractor, url, groupId, updateContract, LPCValidationRules } = this.props;

    if (loading || contract._status === null) return <Loading minHeight={40} />;
    if (contract._status && contract._status !== 200) return <Redirect to={url} />;

    const register = contract.marketLocation
      ? { ...contract.marketLocation.register, name: contract.marketLocation.name, locationId: contract.marketLocation.id }
      : {};
    const prefix = 'admin.contracts';

    if (contract.type === 'contract_localpool_third_party') {
      return <ThirdPartyContract {...{ contract, register, prefix, url }} />;
    }
    if (contract.type === 'contract_localpool_power_taker') {
      return <PowertakerContract {...{ contract, register, contractor, prefix, url }} />;
    }
    if (contract.type === 'contract_localpool_processing') {
      return <LPCContract {...{ contract, contractor, prefix, url, initialValues: contract, groupId, updateContract, validationRules: LPCValidationRules }} />;
    }
    return 'Unknown contract type';
  }
}

interface StatePart {
  contracts: { loadingContract: boolean; contract: { _status: null | number; [key: string]: any }, validationRules: { lpc: any } };
  groups: { loadingGroup: boolean; group: { _status: null | number; [key: string]: any } };
}

interface ExtProps {
  groupId: string;
  contractId: string;
  url: string;
}

interface StateProps {
  loading: boolean;
  contract: { _status: null | number; [key: string]: any };
  contractor: { [key: string]: any };
  LPCValidationRules: any;
}

interface DispatchProps {
  loadContract: Function;
  setContract: Function;
  updateContract: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    loading: state.contracts.loadingContract || state.groups.loadingGroup,
    contract: state.contracts.contract,
    contractor: get(state.groups.group, 'owner', {}),
    // FIXME: replace with real validation rules
    LPCValidationRules: state.contracts.validationRules.lpc,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
  setContract: Contracts.actions.setContract,
  updateContract: Contracts.actions.updateContract,
})(Contract);
