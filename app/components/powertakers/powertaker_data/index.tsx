import * as React from 'react';
import ReactTable from 'react-table';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import Users from 'users';
import Loading from 'components/loading';
import { tableParts as TableParts } from 'react_table_config';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

import './style.scss';

class PowertakerData extends React.Component<ExtProps & DispatchProps & StateProps & InjectedIntlProps> {
  componentWillMount() {
    const { loadUser, userId, groupId, powertaker } = this.props;
    // FIXME: temporary workaround for organizations
    if (!powertaker.id || powertaker.type === 'person') loadUser({ groupId, userId });
  }

  render() {
    const { powertaker, loading, url, intl, history } = this.props;

    if (loading) return <Loading minHeight={40} />;
    if (powertaker._status && powertaker._status !== 200) return <Redirect to={url} />;

    const powertakerImage = powertaker.image || (powertaker.type === 'person' ? DefaultPerson : DefaultOrganisation);
    const powertakerAddress = powertaker.address || {};
    const contact = powertaker.contact || {};
    const contactAddress = get(powertaker, 'contract.address') || {};

    const contracts = get(powertaker.contracts, 'array', []);
    const data = contracts.map(c => ({
      fullContractNumber: c.fullContractNumber,
      type: intl.formatMessage({ id: `admin.contracts.${c.type}` }),
      status: intl.formatMessage({ id: `admin.contracts.${c.status}` }),
      groupName: c.localpool.name,
      registerName: get(c.register, 'name', ''),
      // HACK
      linkRegister: `${url
        .split('/')
        .slice(0, -1)
        .join('/')}/system/${c.register.meterId}/registers/${c.register.id}/readings`,
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableContractNumber' })} />
        ),
        accessor: 'fullContractNumber',
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
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableRegisterName' })} />
        ),
        accessor: 'registerName',
        style: {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
      },
    ];

    return (
      <Row className="powertaker-data">
        <Col xs="3">
          <img className="avatar" src={powertakerImage}/>
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
                  {powertaker.address.street}
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="6" className="fieldname" />
                <Col xs="6" className="grey-underline fieldvalue">
                  {powertaker.address.zip} {powertaker.address.city}
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
              <ReactTable
                {...{
                  data,
                  columns,
                  getTdProps: (_state, rowInfo, column) => ({
                    onClick: (_e, handleOriginal) => {
                      if (column.id === 'registerName' && rowInfo.original.linkRegister) {
                        history.push(rowInfo.original.linkRegister);
                      }
                      if (handleOriginal) handleOriginal();
                    },
                  }),
                }}
              />
            </React.Fragment>
          )}
        </Col>
      </Row>
    );
  }
}

interface StatePart {
  users: { loadingUser: boolean; user: { _status: null | number; [key: string]: any } };
}

interface ExtProps {
  userId: null | string;
  groupId: string;
  powertaker: null | { _status: null | number; [key: string]: any };
  url: string;
}

interface StateProps {
  powertaker: { _status: null | number; [key: string]: any };
  loading: boolean;
}

interface DispatchProps {
  loadUser: Function;
}

function mapStateToProps(state: StatePart, props: ExtProps) {
  return {
    // FIXME: temporary workaround for organizations
    powertaker: props.powertaker || state.users.user,
    loading: state.users.loadingUser,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, { loadUser: Users.actions.loadUser })(injectIntl(PowertakerData));
