import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';

import { EegReportStruct } from 'reports';

import { ReportWrap } from './style';

interface Props {
  groupId: string;
  report: EegReportStruct;
}

const Report: React.FC<Props> = ({ groupId, report: { _status, warnings, ...fields } }) => (
  <ReportWrap>
    {!!warnings.length && (
      <ul>
        {warnings.map(e => (
          <li key={`${e.meterId}-${e.registerId}`}>
            <Link to={`/groups/${groupId}/market-locations/registers/${e.meterId}/${e.registerId}/readings`}>
              {e.reason}
            </Link>
          </li>
        ))}
      </ul>
    )}
    <div className="values-group">
      {Object.keys(fields)
        .filter(k => ['veegWh', 'veegReducedWh'].includes(k))
        .map(k => (
          <div className="values-row" key={k}>
            <div className="field-name important">
              <FormattedMessage id={`admin.reports.${k}`} />:
            </div>
            <div className="field-value">
              <FormattedNumber {...{ style: 'decimal', value: fields[k] / 1000 }} /> kWh
            </div>
          </div>
        ))}
    </div>
    <div className="values-group">
      {Object.keys(fields)
        .filter(k => !['veegWh', 'veegReducedWh'].includes(k))
        .map(k => (
          <div className="values-row" key={k}>
            <div className="field-name">
              <FormattedMessage id={`admin.reports.${k}`} />:
            </div>
            <div className="field-value">
              <FormattedNumber {...{ style: 'decimal', value: fields[k] / 1000 }} /> kWh
            </div>
          </div>
        ))}
    </div>
  </ReportWrap>
);

export default Report;
