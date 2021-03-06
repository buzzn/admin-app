import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { Col, Row } from 'reactstrap';
import Reports, { EegReport, ReportsState, ReportsActions } from 'reports';
import { actions } from 'actions';
import { FormattedMessage } from 'react-intl';
import Loading from 'components/loading';

import Report from './report';

interface ExtProps {
  match: { params: { groupId: string } };
}

interface StatePart {
  reports: ReportsState;
  app: { ui: { reportDates: { beginDate: Date; lastDate: Date } } };
}

interface StateProps {
  eegReport: EegReport;
  loading: boolean;
  reportDates: { beginDate: Date; lastDate: Date };
}

interface DispatchProps {
  loadEeg: ReportsActions;
  setEeg: ReportsActions;
  setUI: Function;
}

momentLocalizer(moment);

type PropsT = {
  groupId: String;
};

interface ExtProps {
  match?: { params: { groupId: string } };
}

interface StatePart {
  reports?: ReportsState;
  app?: { ui: { reportDates: { beginDate: Date; lastDate: Date } } };
}

interface StateProps {
  eegReport?: EegReport;
  loading?: boolean;
  reportDates?: { beginDate: Date; lastDate: Date };
}

interface DispatchProps {
  loadEeg?: ReportsActions;
  setEeg?: ReportsActions;
  setUI?: Function;
}

/**
 * A component which allows the user to request the eeg report or shows
 * the requested report data.
 */
const ReportsUI: React.FC<PropsT & ExtProps & StateProps & DispatchProps> = ({
  eegReport,
  loading,
  loadEeg,
  setEeg,
  setUI,
  reportDates,
  groupId,
}) => {
  // @ts-ignore
  useEffect(() => () => setEeg({ _status: null }), []);

  const [dateRange, setDateRange] = useState(
    reportDates
      ? { beginDate: new Date(reportDates.beginDate), lastDate: new Date(reportDates.lastDate) }
      : { beginDate: new Date(), lastDate: new Date() },
  );

  if (loading) return <Loading minHeight={40} />;

  const prefix = 'admin.reports.eeg';
  return (
    <React.Fragment>
      <div className="controls">
        <Row className="fieldgroup">
          <Col xs="6" className="fieldname">
            <FormattedMessage id={`${prefix}.Start`} />
          </Col>
          <Col xs="6" className="fieldvalue">
            <DateTimePicker
              {...{
                name: 'beginDate',
                value: dateRange.beginDate,
                time: false,
                format: 'DD.MM.YYYY',
                onChange: value => {
                  if (dateRange && setUI) {
                    setDateRange({ ...dateRange, beginDate: value });
                    setUI({ reportDates: { ...dateRange, beginDate: value } });
                  }
                },
              }}
            />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="6" className="fieldname">
            <FormattedMessage id={`${prefix}.End`} />
          </Col>
          <Col xs="6" className="fieldvalue">
            {/*
   // @ts-ignore */}
            <DateTimePicker
              {...{
                name: 'lastDate',
                value: dateRange.lastDate,
                time: false,
                format: 'DD.MM.YYYY',
                onChange: value => {
                  if (dateRange && setUI) {
                    setDateRange({ ...dateRange, lastDate: value });
                    setUI({ reportDates: { ...dateRange, lastDate: value } });
                  }
                },
              }}
            />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="6" />
          <Col xs="6" className="fieldname">
            <button
              className="btn btn-primary"
               // @ts-ignore */
              onClick={() => loadEeg({ groupId: groupId, params: dateRange })}
            >
               <FormattedMessage id={`${prefix}.Submit`} />
            </button>
          </Col>
        </Row>
        <br />

        {eegReport && eegReport._status === 200 ? (
          <React.Fragment>
            {/*
     // @ts-ignore */}
            <Report report={eegReport} groupId={groupId} />
          </React.Fragment>
        ) : eegReport && eegReport._status === 422 ? (
          <div>
            <ul>
              {Object.keys(eegReport)
                .filter(k => !['_status', 'error'].includes(k))
                // @ts-ignore
                .flatMap(k =>
                  eegReport[k].errors.map(e => (
                    <li key={`${e.meterId}-${e.registerId}`}>
                      <Link
                        to={`/groups/${groupId}/market-locations/registers/${
                          e.meterId
                        }/${e.registerId}/readings`}
                      >
                        {e.reason}
                      </Link>
                    </li>
                  )),
                )}
            </ul>
          </div>
        ) : (
          <div /> /* Else do nothing */
        )}
      </div>
    </React.Fragment>
  );
};

function mapStateToprops(state: StatePart): any {
  return {
    eegReport: state.reports ? state.reports.eegReport : null,
    loading: state.reports ? state.reports.loadingEeg : null,
    reportDates: state.app ? state.app.ui.reportDates : null,
  };
}



export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToprops,
  // @ts-ignore
  { loadEeg: Reports.actions.loadEeg, setEeg: Reports.actions.setEeg, setUI: actions.setUI },
)(ReportsUI);
