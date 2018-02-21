import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';

interface Props {
  register: any;
  meter: any;
}

class RegisterData extends React.Component<Props> {
  render() {
    const { register, meter } = this.props;

    const prefix = 'admin.registers';

    return (
      <div>
        <p className="h5 grey-underline header">
          <FormattedMessage id={`${prefix}.headerRegisterDetails`} />
        </p>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.obis`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.obis}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.label`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.${register.label}`} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.direction`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.direction}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id="admin.marketLocations.name" />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.marketLocation.name}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id="admin.meters.productSerialnumber" />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {meter.productSerialnumber}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.meteringPointId`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.meteringPointId}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.shareGroup`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.shareWithGroup ? 'Yes' : 'No'}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.sharePublicly`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.sharePublicly ? 'Yes' : 'No'}
          </Col>
        </Row>
        <p className="h5 grey-underline header" style={{ marginTop: '2rem' }}>
          <FormattedMessage id="admin.registers.headerEdifactInformation" />
        </p>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.postDecimalPosition`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.postDecimalPosition}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.preDecimalPosition`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.preDecimalPosition}
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.lowLoadAbility`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            {register.lowLoadAbility ? 'Yes' : 'No'}
          </Col>
        </Row>
      </div>
    );
  }
}

export default RegisterData;
