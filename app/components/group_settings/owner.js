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

  return [
    <Row key={ 1 } className="fieldgroup">
      <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.${ownerType}` }/></Col>
      <Col xs="8" className="grey-underline">{ name }</Col>
    </Row>,
    <Row key={ 2 } className="fieldgroup">
      <Col xs="4" className="fieldname"></Col>
      <Col xs="8" className="grey-underline">{ address.street }</Col>
    </Row>,
    <Row key={ 3 } className="fieldgroup">
      <Col xs="4" className="fieldname"></Col>
      <Col xs="2" className="grey-underline">{ address.zip }</Col>
      <Col xs="6" className="grey-underline">{ address.city }</Col>
    </Row>,
    <Row key={ 4 } className="fieldgroup">
      <Col xs="4" className="fieldname"></Col>
      <Col xs="8" className="grey-underline">{ owner.phone }</Col>
    </Row>,
    <Row key={ 5 } className="fieldgroup">
      <Col xs="4" className="fieldname"></Col>
      <Col xs="8" className="grey-underline">{ owner.email }</Col>
    </Row>,
    <div>
      {
        owner.type === 'organization' &&
        <Row key={ 5 } className="fieldgroup">
          <Col xs="4" className="fieldname"></Col>
          <Col xs="8" className="grey-underline">{ owner.website }</Col>
        </Row>
      }
    </div>,
    <Row key={ 6 } className="fieldgroup">
      <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.customerNumber` }/></Col>
      <Col xs="8" className="grey-underline">{ owner.customerNumber }</Col>
    </Row>,
  ];
}

export default Owner;
