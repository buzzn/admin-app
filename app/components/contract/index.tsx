import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';
import Contracts from 'contracts';
import Loading from 'components/loading';
import Comments from 'components/comments';

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
      LPThirdUpdateRules,
    } = this.props;

    if (loading || contract._status === null) return <Loading minHeight={40} />;
    if (contract._status && contract._status !== 200) return <Redirect to={url} />;

    const prefix = 'admin.contracts';

    const contractForm = () => {
      if (contract.type === 'contract_localpool_third_party') {
        return (
          <ThirdPartyContract
            {...{
              groupId,
              contract,
              registerMeta: contract.registerMeta,
              prefix,
              initialValues: contract,
              updateContract,
              validationRules: LPThirdUpdateRules,
            }}
          />
        );
      }
      if (contract.type === 'contract_localpool_power_taker') {
        return (
          <div>
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
          <Button color="primary" className="mt-5">
              Reset End Date
          </Button>
          <div className="mt-5"><img src="https://buzzn-core-production.s3-eu-west-1.amazonaws.com/uploads/person/image/000195e5-ceb5-4a95-974d-9ce4646aefe1/22413e7ffa0b3ef9c0467ba0250ff7fe.jpg" alt="test image" /></div>
          </div>
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
    };

    return (
      <React.Fragment>
        {contractForm()}
        <Comments {...{ withHeader: true, ids: { type: 'contract', groupId, contractId: contract.id } }} />
      </React.Fragment>
    );
  }
}

interface StatePart {
  contracts: {
    loadingContract: boolean;
    contract: { _status: null | number; [key: string]: any };
    validationRules: { lpc: any; lptUpdate: any; lpthirdUpdate: any };
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
  LPThirdUpdateRules: any;
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
    LPThirdUpdateRules: state.contracts.validationRules.lpthirdUpdate,
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
