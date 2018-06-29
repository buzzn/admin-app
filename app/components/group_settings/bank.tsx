import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';

interface Props {
  bankAccount: { [key: string]: any };
}

const Bank = ({ bankAccount }: Props) => {
  const prefix = 'admin.groups';

  return (
    <Col xs="12">
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage id={`${prefix}.bankAccount`} />
        </Col>
        <Col xs="8" className="grey-underline fieldvalue">
          {bankAccount.holder}
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className="grey-underline fieldvalue">
          {bankAccount.bankName}
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className="grey-underline fieldvalue">
          {bankAccount.iban}
        </Col>
      </Row>
    </Col>
  );
};

export default Bank;
