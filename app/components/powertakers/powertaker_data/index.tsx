import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import Users from 'users';
import Organizations from 'organizations';
import Loading from 'components/loading';
import { tableParts as TableParts } from 'react_table_config';
import ContractStatus from 'components/contract_status';
import ContractType from 'components/contract_type';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, LargeAvatar } from 'components/style';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

class PowertakerData extends React.Component<
  ExtProps & DispatchProps & StateProps & BreadcrumbsProps & InjectedIntlProps
  > {
  componentDidMount() {
    const { loadUser, loadOrganization, powertakerId, powertakerType } = this.props;
    if (powertakerType === 'person') {
      loadUser({ userId: powertakerId });
    } else {
      loadOrganization({ organizationId: powertakerId });
    }
  }

  render() {
    const { powertaker, loading, url, intl, history, breadcrumbs, title } = this.props;

    if (powertaker._status === null || loading) return <Loading minHeight={40} />;
    if (powertaker._status && powertaker._status !== 200) return <Redirect to={url} />;

    const powertakerImage = powertaker.image || (powertaker.type === 'person' ? DefaultPerson : DefaultOrganisation);
    const powertakerAddress = powertaker.address || {};
    const contact = powertaker.contact || {};
    const contactAddress = get(powertaker, 'contract.address') || {};

    const contracts = get(powertaker.contracts, 'array', []);
    const data = contracts.map(c => ({
      fullContractNumber: c.fullContractNumber,
      type: <ContractType {...{ size: 'large', type: c.type }} />,
      status: <ContractStatus {...{ size: 'large', status: c.status }} />,
      groupName: c.localpool.name,
      marketLocationName: get(c.marketLocation, 'name', ''),
      linkContract: c.type === 'contract_localpool_power_taker' ? `${url}/${c.id}` : '',
      // HACK
      linkMarketLocation: c.marketLocation
        ? `${url
          .split('/')
          .slice(0, -1)
          .join('/')}/market-locations/${c.marketLocation.id}`
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
              <h5 className="grey-underline pb-2">
                <FormattedMessage id={'admin.contracts.headerContactInfo'} />
              </h5>
              {powertaker.type === 'person' ? (
                <React.Fragment>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.prefix" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      <FormattedMessage id={`admin.persons.${powertaker.prefix}`} defaultMessage=" " />
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.title" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      <FormattedMessage id={`admin.persons.${powertaker.title}`} defaultMessage=" " />
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.firstName" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.firstName}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.lastName" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.lastName}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.address" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.street}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname" />
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.zip} {powertakerAddress.city}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.phone" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.phone}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.fax" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.fax}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.email" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      <a href={`mailto:${powertaker.email}`}>{powertaker.email}</a>
                    </Col>
                  </Row>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h5>
                    <FormattedMessage id="admin.organizations.headerOrganization" />
                  </h5>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.organizations.name" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.name}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.organizations.description" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.description}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.organizations.email" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.email}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.organizations.website" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.website}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.organizations.phone" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.phone}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.organizations.fax" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertaker.fax}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.street" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.street}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.zip" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.zip}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.city" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.city}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.state" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.state}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.country" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {powertakerAddress.country}
                    </Col>
                  </Row>
                  <h5>
                    <FormattedMessage id="admin.persons.headerContact" />
                  </h5>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.prefix" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contact.prefix}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.title" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contact.title}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.firstName" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contact.firstName}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.lastName" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contact.lastName}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.email" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contact.email}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.persons.phone" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contact.phone}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.street" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contactAddress.street}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.zip" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contactAddress.zip}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.city" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contactAddress.city}
                    </Col>
                  </Row>
                  <Row className="fieldgroup">
                    <Col xs="6" className="fieldname">
                      <FormattedMessage id="admin.addresses.country" />
                    </Col>
                    <Col xs="6" className="grey-underline fieldvalue">
                      {contactAddress.country}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
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
          </Row>
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  users: { loadingUser: boolean; user: { _status: null | number; [key: string]: any } };
  organizations: { loadingOrganization: boolean; organization: { _status: null | number; [key: string]: any } };
}

interface ExtProps {
  powertakerId: string;
  powertakerType: string;
  url: string;
}

interface StateProps {
  powertaker: { _status: null | number; [key: string]: any };
  loading: boolean;
}

interface DispatchProps {
  loadUser: Function;
  loadOrganization: Function;
}

function mapStateToProps(state: StatePart, props: ExtProps) {
  return {
    powertaker: props.powertakerType === 'person' ? state.users.user : state.organizations.organization,
    loading: state.users.loadingUser || state.organizations.loadingOrganization,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  { loadUser: Users.actions.loadUser, loadOrganization: Organizations.actions.loadOrganization },
)(injectIntl(PowertakerData));
