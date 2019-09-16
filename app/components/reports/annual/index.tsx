import React, { useState } from 'react';
import { connect } from 'react-redux';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import Reports, {ReportsState} from 'reports';
import Loading from 'components/loading';

/**
 * A form to request an annual report for a user specified time span.
 * @param loadAnnualReport Specifies the action to trigger, when a report is requested.
 * @param loading Indicating whether data is being loaded. 
 * @param groupId Specifies the groupId of the report to create.
 * @param groupName The group's name. This is used to generate the default file name of the generated file.
 * @return A component which lets the user request an annual report.
 */
const AnnualReport = ({ loadAnnualReport, loading, groupId, groupName }) => {
  if(loading) {
    return <Loading minHeight={40} />;
  }

  /** The report's first date. */
  const [begin, setBegin] = useState(
    new Date(new Date().getFullYear() - 1, 0, 1),
  );

  /** The report's last date. */
  const [end, setEnd] = useState(
    new Date(new Date().getFullYear() - 1, 11, 31),
  );

  const prefix = 'admin.reports.annual';
  return (
    <div className="controls">
      <Row className="fieldgroup">
        <Col xs="6" className="fieldname">
          <FormattedMessage id={`${prefix}.Start`} />
        </Col>
        <Col xs="6" className="fieldvalue">
          <DateTimePicker
            {...{
              name: 'beginDate',
              value: begin,
              time: false,
              format: 'DD.MM.YYYY',
              onChange: value => setBegin(value),
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="6" className="fieldname">
          <FormattedMessage id={`${prefix}.End`} />
        </Col>
        <Col xs="6" className="fieldvalue">
          <DateTimePicker
            {...{
              name: 'lastDate',
              value: end,
              time: false,
              format: 'DD.MM.YYYY',
              onChange: value => setEnd(value),
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="6" />
        <Col xs="6" className="fieldname">
          <button
            className="btn btn-primary"
            // @ts-ignore
            onClick={() => loadAnnualReport({groupId: groupId, groupName: groupName, params: {begin, end}})}
          >
            <FormattedMessage id={`${prefix}.Submit`} />
          </button>
        </Col>
      </Row>
    </div>
  );
};

type StatePart = {
  loadAnnualReport: Function;
  reports: ReportsState;
};

const mapStateToProps = (state: StatePart) => {
  return {
    loadAnnualReport: state.loadAnnualReport,
    loading: state.reports.loadingAnnualReport
  };
}

export default connect(
  mapStateToProps,
  // @ts-ignore
  { loadAnnualReport: Reports.actions.loadAnnualReport },
)(AnnualReport);
