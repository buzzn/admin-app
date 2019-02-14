import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Contracts from 'contracts';
import Loading from 'components/loading';
import PowertakerContract from './powertaker';
import ThirdPartyContract from './third_party';
import LPCMPOContract from './lpc_mpo';

class Contract extends React.Component<ExtProps & DispatchProps & StateProps> {
  componentDidMount() {
    const { loadContract, groupId, contractId } = this.props;
    loadContract({ groupId, contractId });
  }

  componentWillUnmount() {
    this.props.setContract({ contract: { _status: null }, contractor: { _status: null }, customer: { _status: null } });
  }

  render() {
    const {
      loading,
      contract,
      url,
      groupId,
      updateContract,
      LPCValidationRules,
      LPTUpdateRules,
    } = this.props;

    if (loading || contract._status === null) return <Loading minHeight={40} />;
    if (contract._status && contract._status !== 200) return <Redirect to={url} />;

    const prefix = 'admin.contracts';

    if (contract.type === 'contract_localpool_third_party') {
      return <ThirdPartyContract {...{ contract, registerMeta: contract.registerMeta, prefix, url }} />;
    }
    if (contract.type === 'contract_localpool_power_taker') {
      return (
        <PowertakerContract
          {...{
            contract,
            registerMeta: contract.registerMeta,
            contractor: contract.contractor,
            prefix,
            initialValues: contract,
            groupId,
            updateContract,
            validationRules: LPTUpdateRules,
          }}
        />
      );
    }
    if (['contract_localpool_processing', 'contract_metering_point_operator'].includes(contract.type)) {
      return (
        <LPCMPOContract
          {...{
            contract,
            contractor: contract.contractor,
            prefix,
            url,
            initialValues: contract,
            groupId,
            updateContract,
            validationRules: LPCValidationRules,
          }}
        />
      );
    }
    return 'Unknown contract type';
  }
}

interface StatePart {
  contracts: {
    loadingContract: boolean;
    contract: { _status: null | number; [key: string]: any };
    validationRules: { lpc: any; lptUpdate: any };
  };
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
  LPCValidationRules: any;
  LPTUpdateRules: any;
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
    LPCValidationRules: state.contracts.validationRules.lpc,
    LPTUpdateRules: state.contracts.validationRules.lptUpdate,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadContract: Contracts.actions.loadContract,
    setContract: Contracts.actions.setContract,
    updateContract: Contracts.actions.updateContract,
  },
)(Contract);
