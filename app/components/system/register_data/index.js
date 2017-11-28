// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import ReadingList from '../readings_list';

type Props = {
  devMode: boolean,
  register: Object,
  meter: Object,
};

class RegisterData extends React.Component<Props> {
  render() {
    const {
      devMode,
      register,
      meter,
    } = this.props;

    const prefix = 'admin.registers';

    return (
      <div>
        {
          register.readings && !!register.readings.array.length &&
          <div className={ devMode ? '' : 'under-construction' }>
            <ReadingList readings={ register.readings.array }/>
          </div>
        }
        <p className="h5 grey-underline header"><FormattedMessage id={ `${prefix}.headerRegisterDetails` }/></p>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.name` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.name }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.direction` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.direction }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.label` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.label }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id="admin.meters.productSerialnumber"/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ meter.productSerialnumber }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.meteringPointId` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.meteringPointId }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.lowLoadAbility` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.lowLoadAbility ? 'Yes' : 'No' }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.obis` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.obis }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.sharePublicly` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.sharePublicly ? 'Yes' : 'No' }</Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.shareGroup` }/></Col>
          <Col xs="8" className="grey-underline fieldvalue">{ register.shareWithGroup ? 'Yes' : 'No' }</Col>
        </Row>
      </div>
    );
  }
}

export default RegisterData;
