// @ts-ignore
import React, { useState } from 'react';
import { connect } from 'react-redux';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import Reports, { EegReport, ReportsState, ReportsActions } from 'reports';

import Loading from 'components/loading';

import Report from './report';

momentLocalizer(moment);

const ReportsUI: React.FC<ExtProps & StateProps & DispatchProps> = ({
  eegReport,
  loading,
  loadEeg,
  match: { params: { groupId } },
}) => {
  const [dateRange, setDateRange] = useState({ beginDate: new Date(), lastDate: new Date() });

  if (loading) return <Loading minHeight={40} />;

  return (
    <div>
      <DateTimePicker
        {...{
          name: 'beginDate',
          value: dateRange.beginDate,
          time: false,
          format: 'DD.MM.YYYY',
          onChange: (value) => {
            setDateRange({ ...dateRange, beginDate: value });
          },
        }}
      />
      <DateTimePicker
        {...{
          name: 'lastDate',
          value: dateRange.lastDate,
          time: false,
          format: 'DD.MM.YYYY',
          onChange: (value) => {
            setDateRange({ ...dateRange, lastDate: value });
          },
        }}
      />
      {/*
      // @ts-ignore */}
      <button onClick={() => loadEeg({ groupId, params: dateRange })}>Calculate</button>
      {eegReport._status === 200 ? (
        <React.Fragment>
          {/*
          // @ts-ignore */}
          <Report report={eegReport} />
        </React.Fragment>
      ) : eegReport._status === 422 ? (
        <div>
          {Object.keys(eegReport)
            .filter(k => !['_status', 'error'].includes(k))
            // @ts-ignore
            .flatMap(k => eegReport[k].errors.map(e => e.reason))
            .reduce((res, str) => (res.find(r => r === str) ? res : [...res, str]), [])}
        </div>
      ) : (
        <div>Please, select dates and press "Calculate"</div>
      )}
    </div>
  );
};

function mapStateToprops(state: StatePart) {
  return {
    eegReport: state.reports.eegReport,
    loading: state.reports.loadingEeg,
  };
}

interface ExtProps {
  match: { params: { groupId: string } };
}

interface StatePart {
  reports: ReportsState;
}

interface StateProps {
  eegReport: EegReport;
  loading: boolean;
}

interface DispatchProps {
  loadEeg: ReportsActions;
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToprops,
  // @ts-ignore
  { loadEeg: Reports.actions.loadEeg },
)(ReportsUI);
