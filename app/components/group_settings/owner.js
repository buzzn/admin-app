// @flow
import * as React from 'react';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

type Props = {
  owner: Object,
  address: Object,
  contact?: boolean,
};

const Owner = ({ owner, address, contact }: Props) => {
  const prefix = owner.type === 'person' ? 'admin.persons' : 'admin.organizations';
  const name = owner.type === 'person' ? `${owner.firstName} ${owner.lastName}` : owner.name;
  let ownerType = 'headerContact';
  if (owner.type === 'organization') ownerType = 'headerOrganization';
  if (contact) ownerType = 'headerContact';

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.${ownerType}` }/></Col>
        <Col xs="8" className="grey-underline fieldvalue">{ name }</Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname"></Col>
        <Col xs="8" className="grey-underline fieldvalue">{ address.street }</Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname"></Col>
        <Col xs="2" className="grey-underline fieldvalue">{ address.zip }</Col>
        <Col xs="6" className="grey-underline fieldvalue">{ address.city }</Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname"></Col>
        <Col xs="8" className="grey-underline fieldvalue">{ owner.phone }</Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname"></Col>
        <Col xs="8" className="grey-underline fieldvalue">{ owner.email }</Col>
      </Row>
      <React.Fragment>
        {
          owner.type === 'organization' &&
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname"></Col>
            <Col xs="8" className="grey-underline fieldvalue">{ owner.website }</Col>
          </Row>
        }
      </React.Fragment>
    </React.Fragment>
  );
};

export default Owner;
