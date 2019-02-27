import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import Users from 'users';
import Organizations from 'organizations';
import Contracts from 'contracts';
import Loading from 'components/loading';
import { tableParts as TableParts } from 'react_table_config';
import ContractStatus from 'components/contract_status';
import ContractType from 'components/contract_type';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import withEditOverlay from 'components/with_edit_overlay';
import { CenterContent, LargeAvatar } from 'components/style';
import BankAccounts from 'components/bank_accounts';
import PowertakerForm from './powertaker_form';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

class PowertakerData extends React.Component<
  ExtProps & DispatchProps & StateProps & BreadcrumbsProps & InjectedIntlProps
  > {
  loadPowertaker = () => {
    const { loadGroupUser, loadGroupOrganization, powertakerId, powertakerType, groupId } = this.props;
    if (powertakerType === 'person') {
      loadGroupUser({ userId: powertakerId, groupId });
    } else {
      loadGroupOrganization({ organizationId: powertakerId, groupId });
    }
  };

  componentDidMount() {
    this.loadPowertaker();
  }

  render() {
    const {
      powertaker,
      loading,
      url,
      intl,
      history,
      breadcrumbs,
      title,
      availableUsers,
      validationRules,
      powertakerType,
      loadGroupUser,
      loadGroupOrganization,
      updateContract,
      groupId,
      contractId,
      powertakerId,
      loadAvailableUsers,
      loadingOptions,
      updatable,
    } = this.props;

    if (powertaker._status === null || loading) return <Loading minHeight={40} />;
    if (powertaker._status && powertaker._status !== 200) return <Redirect to={url} />;

    const powertakerImage = powertaker.image || (powertakerType === 'person' ? DefaultPerson : DefaultOrganisation);

    const contracts = get(powertaker.contracts, 'array', []);
    const data = contracts.map(c => ({
      fullContractNumber: c.fullContractNumber,
      type: <ContractType {...{ size: 'large', type: c.type }} />,
      status: <ContractStatus {...{ size: 'large', status: c.status }} />,
      groupName: c.localpool.name,
      marketLocationName: get(c.registerMeta, 'name', ''),
      linkContract: c.type === 'contract_localpool_power_taker' ? `${url}/${c.id}` : '',
      // HACK
      linkMarketLocation: c.registerMeta
        ? `${url
          .split('/')
          .slice(0, -1)
          .join('/')}/market-locations/${c.registerMeta.id}`
        : '',
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableContractNumber' })} />
        ),
        accessor: 'fullContractNumber',
        style: {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
        sortMethod: TableParts.sort.sortByFulContractNumber,
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableType' })} />
        ),
        accessor: 'type',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableStatus' })} />
        ),
        accessor: 'status',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableGroupName' })} />
        ),
        accessor: 'groupName',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableMarketLocation' })} />
        ),
        accessor: 'marketLocationName',
        style: {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
      },
    ];

    return (
      <React.Fragment>
        <PageTitle {...{ breadcrumbs, title }} />
        <CenterContent>
          <Row className="powertaker-data">
            <Col xs="3">
              <LargeAvatar src={powertakerImage} />
            </Col>
            <Col xs="9">
              <PowertakerForm
                {...{
                  availableUsers,
                  validationRules,
                  powertakerType,
                  powertaker,
                  initialValues: powertaker,
                  loadGroupUser,
                  loadGroupOrganization,
                  updateContract,
                  groupId,
                  contractId,
                  powertakerId,
                  loadAvailableUsers,
                  loadingOptions,
                  updatable,
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {contracts.length > 0 && (
                <React.Fragment>
                  <h5 className="grey-underline mt-5 pb-2">
                    <FormattedMessage id={'admin.contracts.headerContractsList'} />
                  </h5>
                  <ReactTableSorted
                    {...{
                      data,
                      columns,
                      getTdProps: (_state, rowInfo, column) => ({
                        onClick: (_e, handleOriginal) => {
                          if (column.id === 'marketLocationName' && rowInfo.original.linkMarketLocation) {
                            history.push(rowInfo.original.linkMarketLocation);
                          }
                          if (column.id === 'fullContractNumber' && rowInfo.original.linkContract.length) {
                            history.push(rowInfo.original.linkContract);
                          }
                          if (handleOriginal) handleOriginal();
                        },
                      }),
                      uiSortPath: `powertakers.${powertaker.id}.registers`,
                    }}
                  />
                </React.Fragment>
              )}
            </Col>
            <Col xs={12}>
              <BankAccounts
                {...{
                  bankAccounts: get(powertaker, 'bankAccounts.array', []),
                  groupId,
                  partyId: powertaker.id,
                  partyType: powertaker.type,
                  reloadCb: this.loadPowertaker,
                }}
              />
            </Col>
          </Row>
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  users: {
    loadingGroupUser: boolean;
    groupUser: { _status: null | number; [key: string]: any };
    availableUsers: { _status: null | number; array: Array<any> };
    loadingAvailableUsers: boolean;
  };
  organizations: { loadingGroupOrganization: boolean; groupOrganization: { _status: null | number; [key: string]: any } };
  contracts: {
    validationRules: {
      lptOrgCustomer: { [key: string]: { any } };
      lptPerCustomer: { [key: string]: { any } };
    };
  };
}

interface ExtProps {
  powertakerId: string;
  powertakerType: string;
  url: string;
  groupId: string;
  contractId: string;
  updatable: boolean;
}

interface StateProps {
  powertaker: { _status: null | number; [key: string]: any };
  loading: boolean;
  availableUsers: { _status: null | number; array: Array<any> };
  loadingOptions: boolean;
  validationRules: {
    lptOrgCustomer: { [key: string]: { any } };
    lptPerCustomer: { [key: string]: { any } };
  };
}

interface DispatchProps {
  loadGroupUser: Function;
  loadGroupOrganization: Function;
  loadAvailableUsers: Function;
  updateContract: Function;
}

function mapStateToProps(state: StatePart, props: ExtProps) {
  return {
    powertaker: props.powertakerType === 'person' ? state.users.groupUser : state.organizations.groupOrganization,
    loading: state.users.loadingGroupUser || state.organizations.loadingGroupOrganization,
    loadingOptions: state.users.loadingAvailableUsers,
    availableUsers: state.users.availableUsers,
    validationRules: state.contracts.validationRules,
  };
}

const PowertakerWithForm = reduxForm({
  form: 'powertakerCustomerForm',
  enableReinitialize: true,
})(withEditOverlay(PowertakerData));

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadGroupUser: Users.actions.loadGroupUser,
    loadGroupOrganization: Organizations.actions.loadGroupOrganization,
    loadAvailableUsers: Users.actions.loadAvailableUsers,
    updateContract: Contracts.actions.updateContract,
  },
)(injectIntl(PowertakerWithForm));
