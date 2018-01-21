import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import Users from 'users';
import Loading from 'components/loading';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

class PowertakerData extends React.Component<ExtProps & DispatchProps & StateProps> {
  componentWillMount() {
    const { loadUser, userId, groupId, powertaker } = this.props;
    // FIXME: temporary workaround for organizations
    if (!powertaker.id || powertaker.type === 'person') loadUser({ groupId, userId });
  }

  render() {
    const { powertaker, loading, url } = this.props;

    if (loading) return <Loading minHeight={40} />;
    if (powertaker._status && powertaker._status !== 200) return <Redirect to={url} />;

    const powertakerTitle =
      powertaker.type === 'person' ? `${powertaker.firstName} ${powertaker.lastName}` : powertaker.name;
    const powertakerImage = powertaker.image || (powertaker.type === 'person' ? DefaultPerson : DefaultOrganisation);
    const powertakerAddress = powertaker.address || {};
    const contact = powertaker.contact || {};
    const contactAddress = get(powertaker, 'contract.address') || {};

    return (
      <Row>
        <Col xs="3">
          <img className="top-avatar" src={powertakerImage} />
          {powertakerTitle}
        </Col>
        <Col xs="9">
          {powertaker.type === 'person' ? (
            <React.Fragment>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.prefix" />:
                </Col>
                <Col xs="6">{powertaker.prefix}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.title" />:
                </Col>
                <Col xs="6">{powertaker.title}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.firstName" />:
                </Col>
                <Col xs="6">{powertaker.firstName}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.lastName" />:
                </Col>
                <Col xs="6">{powertaker.lastName}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.email" />:
                </Col>
                <Col xs="6">{powertaker.email}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.phone" />:
                </Col>
                <Col xs="6">{powertaker.phone}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.street" />:
                </Col>
                <Col xs="6">{powertakerAddress.street}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.zip" />:
                </Col>
                <Col xs="6">{powertakerAddress.zip}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.city" />:
                </Col>
                <Col xs="6">{powertakerAddress.city}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.country" />:
                </Col>
                <Col xs="6">{powertakerAddress.country}</Col>
              </Row>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h5>
                <FormattedMessage id="admin.organizations.headerOrganization" />:
              </h5>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.organizations.name" />:
                </Col>
                <Col xs="6">{powertaker.name}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.organizations.description" />:
                </Col>
                <Col xs="6">{powertaker.description}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.organizations.email" />:
                </Col>
                <Col xs="6">{powertaker.email}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.organizations.website" />:
                </Col>
                <Col xs="6">{powertaker.website}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.organizations.phone" />:
                </Col>
                <Col xs="6">{powertaker.phone}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.organizations.fax" />:
                </Col>
                <Col xs="6">{powertaker.fax}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.street" />:
                </Col>
                <Col xs="6">{powertakerAddress.street}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.zip" />:
                </Col>
                <Col xs="6">{powertakerAddress.zip}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.city" />:
                </Col>
                <Col xs="6">{powertakerAddress.city}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.state" />:
                </Col>
                <Col xs="6">{powertakerAddress.state}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.country" />:
                </Col>
                <Col xs="6">{powertakerAddress.country}</Col>
              </Row>
              <h5>
                <FormattedMessage id="admin.persons.headerContact" />:
              </h5>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.prefix" />:
                </Col>
                <Col xs="6">{contact.prefix}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.title" />:
                </Col>
                <Col xs="6">{contact.title}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.firstName" />:
                </Col>
                <Col xs="6">{contact.firstName}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.lastName" />:
                </Col>
                <Col xs="6">{contact.lastName}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.email" />:
                </Col>
                <Col xs="6">{contact.email}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.persons.phone" />:
                </Col>
                <Col xs="6">{contact.phone}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.street" />:
                </Col>
                <Col xs="6">{contactAddress.street}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.zip" />:
                </Col>
                <Col xs="6">{contactAddress.zip}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.city" />:
                </Col>
                <Col xs="6">{contactAddress.city}</Col>
              </Row>
              <Row>
                <Col xs="6">
                  <FormattedMessage id="admin.addresses.country" />:
                </Col>
                <Col xs="6">{contactAddress.country}</Col>
              </Row>
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

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, { loadUser: Users.actions.loadUser })(PowertakerData);
