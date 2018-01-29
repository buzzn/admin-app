import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Redirect, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import get from 'lodash/get';
import truncate from 'lodash/truncate';
import moment from 'moment';
import { formatLabel } from '_util';
import Contracts from 'contracts';
import Loading from 'components/loading';
import ContractStatus from 'components/contract_status';
import ContractType from 'components/contract_type';

import './style.scss';

class Contract extends React.Component<ExtProps & DispatchProps & StateProps & InjectedIntlProps> {
  componentWillMount() {
    const { loadContract, groupId, contractId } = this.props;
    loadContract({ groupId, contractId });
  }

  render() {
    const { loading, contract, contractor, intl, url } = this.props;

    if (loading || contract._status === null) return <Loading minHeight={40} />;
    if (contract._status && contract._status !== 200) return <Redirect to={url} />;

    const prefix = 'admin.contracts';

    const register = contract.register || {};

    return (
      <div className="contract-data">
        <Row className="contract-header">
          <Col xs="11" style={{ borderRight: '1px #E0E0E0 solid' }}>
            <Row style={{ borderBottom: '1px #E0E0E0 solid', height: '80px' }}>
              <Col xs="6" style={{ padding: '20px 0 20px 20px' }}>
                <Link to={`${url}/${contract.id}/powertaker`} className="big-link">
                  {truncate(contract.customer.name || `${contract.customer.firstName} ${contract.customer.lastName}`, { length: 25 })}{' '}
                  >
                </Link>
                <span className="link-type">
                  <FormattedMessage id={`${prefix}.objectTypePowerGiver`} />
                </span>
              </Col>
              <Col xs="6" style={{ padding: '20px 0 20px 20px' }}>
                <Link
                  className="big-link"
                  to={`${url
                    .split('/')
                    .slice(0, -1)
                    .join('/')}/system/${register.meterId}/registers/${register.id}/readings`}
                >
                  {truncate(register.name, { length: 25 })} >
                </Link>
                <span className="link-type">
                  <FormattedMessage id={`${prefix}.objectTypePowerRegister`} />
                </span>
              </Col>
            </Row>
            <Row style={{ height: '80px' }}>
              <Col xs="6" style={{ padding: '20px 0 20px 20px' }}>
                <span className="big-link">
                  {truncate(contractor.name || `${contractor.firstName} ${contractor.lastName}`, { length: 25 })}
                </span>
                <span className="link-type">
                  <FormattedMessage id={`${prefix}.objectTypePowerTaker`} />
                </span>
              </Col>
              <Col xs="6" />
            </Row>
          </Col>
          <Col xs="1">
            <Row style={{ height: '80px' }}>
              <Col xs="12" style={{ padding: '30px 20px 20px 20px' }}>
                <ContractStatus status={contract.status} size="large" />
              </Col>
            </Row>
            <Row style={{ height: '80px' }}>
              <Col xs="12" style={{ padding: '20px 20px 20px 16px' }}>
                <ContractType type={contract.type} size="large" />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <h5 className="grey-underline mt-5 pb-2">
              <FormattedMessage id={`${prefix}.headerContractsDetails`} />
            </h5>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.registerName`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                <Link
                  to={`${url
                    .split('/')
                    .slice(0, -1)
                    .join('/')}/system/${register.meterId}/registers/${register.id}/readings`}
                >
                  {register.name}
                </Link>
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.meterSerial`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                <Link
                  to={`${url
                    .split('/')
                    .slice(0, -1)
                    .join('/')}/system/${register.meterId}`}
                >
                  {register.meter.productSerialnumber}
                </Link>
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.renewableEnergyLawTaxation`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {intl.formatMessage({ id: `${prefix}.${contract.renewableEnergyLawTaxation}` })}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.customer`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                <Link to={`${url}/${contract.id}/powertaker`}>
                  {contract.customer.name || `${contract.customer.firstName} ${contract.customer.lastName}`}
                </Link>
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.customerNumber`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contract.customer.customerNumber}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.contractor`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contractor.name || `${contractor.firstName} ${contractor.lastName}`}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.forecastKwhPa`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {formatLabel(contract.forecastKwhPa, 'h')}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.oldSupplierName`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contract.oldSupplierName}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.oldCustomerNumber`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contract.oldCustomerNumber}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.oldAccountNumber`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contract.oldAccountNumber}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.thirdPartyRenterNumber`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contract.thirdPartyRenterNumber}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.thirdPartyBillingNumber`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {contract.thirdPartyBillingNumber}
              </Col>
            </Row>
            <h5 className="grey-underline mt-5 pb-2">
              <FormattedMessage id={`${prefix}.headerDates`} />
            </h5>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.status`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                <FormattedMessage id={`${prefix}.${contract.status}`}/>
                <ContractStatus status={contract.status} size="large" />
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.signingDate`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {moment(contract.signingDate).format('DD.MM.YYYY')}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.beginDate`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {moment(contract.beginDate).format('DD.MM.YYYY')}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.terminationDate`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {moment(contract.terminationDate).format('DD.MM.YYYY')}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="6" className="fieldname">
                <FormattedMessage id={`${prefix}.endDate`} />
              </Col>
              <Col xs="6" className="grey-underline fieldvalue">
                {moment(contract.endDate).format('DD.MM.YYYY')}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

interface StatePart {
  contracts: { loadingContract: boolean; contract: { _status: null | number; [key: string]: any } };
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
}

interface DispatchProps {
  loadContract: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    loading: state.contracts.loadingContract || state.groups.loadingGroup,
    contract: state.contracts.contract,
    contractor: get(state.groups.group, 'owner', {}),
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, { loadContract: Contracts.actions.loadContract })(injectIntl(Contract));
