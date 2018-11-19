import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { FormTitle } from 'components/style';
import RegistersList from './registers_list';
import { MeterHeader } from './style';

interface Props {
  meter: any;
  url: string;
  history: any;
}

class MeterData extends React.Component<Props> {
  render() {
    const { meter, history, url } = this.props;

    const prefix = 'admin.meters';

    return (
      <div className="meter-data">
        <MeterHeader>
          <Col xs="3">
            <div className="value">{meter.datasource}</div>
            <div className="label">
              <FormattedMessage id={`${prefix}.dataSource`} />
            </div>
          </Col>
          <Col xs="3">
            <div className="value">{meter.sequenceNumber}</div>
            <div className="label">
              <FormattedMessage id={`${prefix}.sequenceNumber`} />
            </div>
          </Col>
          <Col xs="2">
            <div className="value">{meter.productSerialnumber}</div>
            <div className="label">
              <FormattedMessage id={`${prefix}.productSerialnumber`} />
            </div>
          </Col>
          <Col xs="2">
            <div className="value">
              <FormattedMessage id={`${prefix}.${meter.type}`} />
            </div>
            <div className="label">
              <FormattedMessage id={`${prefix}.type`} />
            </div>
          </Col>
          <Col xs="1" />
        </MeterHeader>
        <Row>
          <Col xs="12">
            <FormTitle>
              <FormattedMessage id={`${prefix}.headerRegistersReadings`} />
            </FormTitle>
            <RegistersList {...{ registers: meter.registers, history, url }} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MeterData;
