import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';
import Owner from './owner';

interface Props {
  owner: any;
  ownerAddress: any;
  ownerContact: any;
  ownerContactAddress: any;
}

const Powergiver = ({ owner, ownerAddress, ownerContact, ownerContactAddress }: Props) => {
  const prefix = 'admin.groups';

  return (
    <Col xs="12">
      <p className="h5 grey-underline header text-uppercase">
        <FormattedMessage id={`${prefix}.headerPowergiver`} />
      </p>
      {owner.type === 'person' ? (
        <Owner {...{ address: ownerAddress, owner }} />
      ) : (
        <React.Fragment>
          <Owner {...{ address: ownerAddress, owner }} />
          {!!ownerContact.id && <Owner {...{ contact: true, address: ownerContactAddress, owner: ownerContact }} />}
        </React.Fragment>
      )}
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage id={`${prefix}.customerNumber`} />
        </Col>
        <Col xs="8" className="grey-underline fieldvalue">
          {owner.customerNumber}
        </Col>
      </Row>
    </Col>
  );
};

export default Powergiver;
