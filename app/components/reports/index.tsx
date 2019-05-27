import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import Reports, { EegReport, ReportsState, ReportsActions } from 'reports';
import { actions } from 'actions';

import Loading from 'components/loading';

import Report from './report';

import { ReportsWrap } from './style';

momentLocalizer(moment);

const ReportsUI: React.FC<ExtProps & StateProps & DispatchProps> = ({
  eegReport,
  loading,
  loadEeg,
  setEeg,
  setUI,
  reportDates = { beginDate: new Date(), lastDate: new Date() },
  match: { params: { groupId } },
}) => {
  // @ts-ignore
  useEffect(() => () => setEeg({ _status: null }), []);

  const [dateRange, setDateRange] = useState({ ...reportDates });

  if (loading) return <Loading minHeight={40} />;

  return (
    <ReportsWrap>
      <h4>EEG Report</h4>
      <div className="controls">
        <DateTimePicker
          {...{
            name: 'beginDate',
            value: dateRange.beginDate,
            time: false,
            format: 'DD.MM.YYYY',
            onChange: (value) => {
              setDateRange({ ...dateRange, beginDate: value });
              setUI({ reportDates: { ...dateRange, beginDate: value } });
            },
          }}
        />
        {/*
        // @ts-ignore */}
        <button className="btn btn-secondary" onClick={() => loadEeg({ groupId, params: dateRange })}>Calculate</button>
        <DateTimePicker
          {...{
            name: 'lastDate',
            value: dateRange.lastDate,
            time: false,
            format: 'DD.MM.YYYY',
            onChange: (value) => {
              setDateRange({ ...dateRange, lastDate: value });
              setUI({ reportDates: { ...dateRange, lastDate: value } });
            },
          }}
        />
      </div>
      {eegReport._status === 200 ? (
        <React.Fragment>
          {/*
          // @ts-ignore */}
          <Report report={eegReport} groupId={groupId} />
        </React.Fragment>
      ) : eegReport._status === 422 ? (
        <div>
          <ul>
            {Object.keys(eegReport)
              .filter(k => !['_status', 'error'].includes(k))
              // @ts-ignore
              .flatMap(k => eegReport[k].errors.map(e => (
                  <li key={`${e.meterId}-${e.registerId}`}>
                    <Link to={`/groups/${groupId}/market-locations/registers/${e.meterId}/${e.registerId}/readings`}>
                      {e.reason}
                    </Link>
                  </li>
              )))}
          </ul>
        </div>
      ) : (
        <div>Please, select dates and press "Calculate"</div>
      )}
    </ReportsWrap>
  );
};

function mapStateToprops(state: StatePart) {
  return {
    eegReport: state.reports.eegReport,
    loading: state.reports.loadingEeg,
    reportDates: state.app.ui.reportDates,
  };
}

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

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToprops,
  // @ts-ignore
  { loadEeg: Reports.actions.loadEeg, setEeg: Reports.actions.setEeg, setUI: actions.setUI },
)(ReportsUI);
